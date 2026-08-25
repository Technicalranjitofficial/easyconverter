"use client";

import { useState, useCallback, useRef } from "react";
import { Loader2, FileText, Eye, Download, RotateCcw, AlertCircle, CheckCircle2 } from "lucide-react";
import { formatBytes } from "@/lib/utils/fileUtils";
import { triggerDownload } from "@/lib/utils/downloadUtils";

const ACCEPTED_EXT = [".docx", ".doc"];

export default function DocxToPdf() {
  const [file, setFile]             = useState<File | null>(null);
  const [loading, setLoading]       = useState(false);
  const [rendered, setRendered]     = useState(false);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress]     = useState(0);
  const [error, setError]           = useState<string | null>(null);

  // Preview container — always mounted
  const previewRef = useRef<HTMLDivElement>(null);
  // Isolated iframe for clean canvas capture — no Tailwind contamination
  const captureIframeRef = useRef<HTMLIFrameElement>(null);

  // ── File selection ─────────────────────────────────────────────────────────
  const selectFile = (f: File) => {
    setFile(f); setRendered(false); setError(null); setProgress(0);
    if (previewRef.current) previewRef.current.innerHTML = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = Array.from(e.dataTransfer.files).find(f =>
      ACCEPTED_EXT.some(ext => f.name.toLowerCase().endsWith(ext))
    );
    if (f) selectFile(f);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) selectFile(f);
    e.target.value = "";
  };

  // ── Step 1: Preview DOCX in the visible preview div ────────────────────────
  const handleRender = useCallback(async () => {
    if (!file) return;
    const container = previewRef.current;
    if (!container) { setError("Preview container not ready. Please refresh."); return; }

    setLoading(true); setError(null);
    container.innerHTML = "";

    try {
      const { renderAsync } = await import("docx-preview");
      const buf = await file.arrayBuffer();
      await renderAsync(buf, container, undefined, {
        className: "docx-preview",
        inWrapper: true,
        ignoreWidth: false,
        ignoreFonts: false,
        breakPages: true,
        useBase64URL: true,
        renderHeaders: true,
        renderFooters: true,
        renderFootnotes: true,
        renderEndnotes: true,
      });
      setRendered(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to render document.");
      container.innerHTML = "";
    } finally {
      setLoading(false);
    }
  }, [file]);

  // ── Step 2: Download PDF ────────────────────────────────────────────────────
  // Strategy: re-render the DOCX into an isolated offscreen iframe that has
  // NO Tailwind CSS, then use jsPDF's native html() renderer for proper CSS layout.
  const handleDownloadPdf = useCallback(async () => {
    if (!file || !rendered) return;

    setConverting(true); setProgress(5); setError(null);

    try {
      const [{ renderAsync }, { default: jsPDF }] = await Promise.all([
        import("docx-preview"),
        import("jspdf"),
      ]);

      const buf = await file.arrayBuffer();
      setProgress(15);

      // Create a completely isolated offscreen iframe — no Tailwind, no oklch
      const iframe = document.createElement("iframe");
      iframe.style.cssText = "position:fixed;top:-9999px;left:-9999px;width:794px;border:none;visibility:hidden;";
      document.body.appendChild(iframe);

      const iDoc = iframe.contentDocument!;
      iDoc.open();
      iDoc.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; background: #fff; width: 794px; }
    /* Remove docx-preview's page shadow/background so jsPDF sees clean content */
    .docx-wrapper { background: none !important; padding: 0 !important; }
    .docx { background: #fff !important; box-shadow: none !important; margin: 0 !important;
            padding: 72px 80px !important; width: 100% !important; min-height: auto !important; }
  </style>
</head>
<body></body>
</html>`);
      iDoc.close();

      // Render DOCX into the clean iframe
      await renderAsync(buf, iDoc.body, undefined, {
        className: "docx-preview",
        inWrapper: true,
        ignoreWidth: false,
        ignoreFonts: false,
        breakPages: false,   // let jsPDF handle page breaks
        useBase64URL: true,
        renderHeaders: true,
        renderFooters: true,
        renderFootnotes: true,
        renderEndnotes: true,
      });

      setProgress(40);

      // Wait for images/fonts to render inside iframe
      await new Promise(r => setTimeout(r, 600));

      // Get actual content height
      const iBody = iDoc.body;
      const contentHeight = iBody.scrollHeight;

      // Resize iframe to full content height so jsPDF captures everything
      iframe.style.height = `${contentHeight}px`;
      await new Promise(r => setTimeout(r, 100));

      setProgress(50);

      // Use jsPDF html() — it renders HTML directly without screenshot artifacts
      const pdf = new jsPDF({
        unit: "pt",
        format: "a4",
        orientation: "portrait",
      });

      const A4_WIDTH_PT  = 595.28;  // A4 width in pt
      const A4_HEIGHT_PT = 841.89;  // A4 height in pt
      const MARGIN_PT    = 40;

      await new Promise<void>((resolve, reject) => {
        pdf.html(iBody, {
          x: MARGIN_PT,
          y: MARGIN_PT,
          width: A4_WIDTH_PT - MARGIN_PT * 2,
          windowWidth: 794,
          margin: [MARGIN_PT, MARGIN_PT, MARGIN_PT, MARGIN_PT],
          autoPaging: "text",
          html2canvas: {
            scale: (A4_WIDTH_PT - MARGIN_PT * 2) / (794 - 2 * 40),
            useCORS: true,
            allowTaint: true,
            backgroundColor: "#ffffff",
            logging: false,
            // Sanitize oklch in the cloned DOM
            onclone: (clonedDoc: Document) => {
              const all = (clonedDoc.body ?? clonedDoc).querySelectorAll("*");
              all.forEach((el) => {
                const htmlEl = el as HTMLElement;
                const s = htmlEl.getAttribute?.("style") ?? "";
                if (/(?:oklch|oklab|lab|lch|color)\s*\(/.test(s)) {
                  htmlEl.removeAttribute("style");
                }
              });
            },
          },
          callback: (doc) => {
            document.body.removeChild(iframe);
            setProgress(95);
            const pdfBlob = doc.output("blob");
            const fileName = file.name.replace(/\.docx?$/i, ".pdf");
            triggerDownload(pdfBlob, fileName);
            resolve();
          },
        });
      });

      setProgress(100);

    } catch (e) {
      setError(`Conversion failed: ${e instanceof Error ? e.message : "Unknown error"}`);
      // Clean up iframe if still present
      document.querySelector("iframe[style*='-9999px']")?.remove();
    } finally {
      setConverting(false);
      setProgress(0);
    }
  }, [file, rendered]);

  const reset = () => {
    setFile(null); setRendered(false); setError(null); setProgress(0);
    if (previewRef.current) previewRef.current.innerHTML = "";
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="w-full space-y-5">
      {/* Hidden capture iframe — always mounted */}
      <iframe ref={captureIframeRef} style={{ display: "none" }} title="docx-capture" />

      {/* Drop zone */}
      {!file && (
        <label onDrop={handleDrop} onDragOver={e => e.preventDefault()}
          className="relative flex flex-col items-center justify-center w-full min-h-[220px]
                     rounded-2xl border-2 border-dashed border-slate-300 cursor-pointer
                     bg-gradient-to-b from-slate-50 to-white
                     hover:border-indigo-400 hover:bg-indigo-50/30 transition-all duration-300">
          <input type="file" accept=".docx,.doc" onChange={handleInput} className="sr-only" />
          <div className="flex flex-col items-center gap-3 p-8 text-center pointer-events-none">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
              <FileText className="w-7 h-7 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-1">Drop your Word document here</p>
              <p className="text-xs text-slate-400">or click to browse</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="px-2 py-1 rounded-md bg-slate-100 font-mono">.docx</span>
              <span className="px-2 py-1 rounded-md bg-slate-100 font-mono">.doc</span>
              <span>· Max 20 MB</span>
            </div>
          </div>
        </label>
      )}

      {/* File badge */}
      {file && (
        <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
            <FileText className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-700 truncate">{file.name}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-xs text-slate-400">{formatBytes(file.size)}</p>
              {rendered && !converting && (
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                  <CheckCircle2 className="w-3 h-3" />Preview ready
                </span>
              )}
            </div>
          </div>
          <button onClick={reset} title="Remove"
            className="text-slate-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Step 1: Preview button */}
      {file && !rendered && !loading && !error && (
        <button onClick={handleRender}
          className="w-full flex items-center justify-center gap-2.5
                     py-4 rounded-2xl font-semibold text-white text-base
                     bg-gradient-to-r from-blue-700 to-blue-500
                     hover:from-blue-600 hover:to-blue-400
                     shadow-[0_4px_20px_rgba(59,130,246,0.35)]
                     hover:-translate-y-0.5 transition-all duration-200">
          <Eye className="w-5 h-5" />Step 1 — Preview Document
        </button>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-8 gap-2.5 text-sm text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin text-blue-500" />Rendering document…
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 animate-fade-in">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-700">Error</p>
            <p className="text-xs text-red-600 mt-0.5 leading-relaxed">{error}</p>
            {!rendered && (
              <button onClick={handleRender}
                className="mt-2 text-xs font-semibold text-red-600 underline hover:text-red-800">
                Try again
              </button>
            )}
          </div>
        </div>
      )}

      {/* Step 2: Download button */}
      {rendered && !converting && (
        <button onClick={handleDownloadPdf}
          className="w-full flex items-center justify-center gap-2.5
                     py-4 rounded-2xl font-semibold text-white text-base
                     bg-gradient-to-r from-slate-900 via-indigo-700 to-indigo-600
                     hover:from-slate-800 hover:via-indigo-600 hover:to-indigo-500
                     shadow-[0_4px_20px_rgba(79,70,229,0.4)]
                     hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200">
          <Download className="w-5 h-5" />Step 2 — Download PDF
        </button>
      )}

      {/* Conversion progress */}
      {converting && (
        <div className="space-y-3">
          <div className="flex justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-500" />
              {progress < 20 ? "Preparing document…" : progress < 40 ? "Rendering pages…" : "Generating PDF…"}
            </span>
            <span className="font-mono font-semibold text-indigo-600">{progress}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full transition-all duration-300"
                 style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* Preview container — always mounted, hidden when empty */}
      <div className={`rounded-2xl overflow-hidden border border-slate-200 shadow-sm ${!file || (!rendered && !loading) ? "hidden" : ""}`}>
        {(rendered || loading) && (
          <div className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-900">
            <Eye className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
              {loading ? "Rendering…" : "Document Preview"}
            </span>
            {rendered && <span className="ml-auto text-xs text-slate-500">Review, then click Download PDF</span>}
          </div>
        )}
        <div ref={previewRef} className="bg-slate-100 max-h-[600px] overflow-y-auto" />
      </div>
    </div>
  );
}

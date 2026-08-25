"use client";

import { useState, useCallback, useRef } from "react";
import {
  Loader2, FileText, Eye, Download, RotateCcw,
  AlertCircle, CheckCircle2,
} from "lucide-react";
import { formatBytes } from "@/lib/utils/fileUtils";
import { triggerDownload } from "@/lib/utils/downloadUtils";

const ACCEPTED_EXT = [".docx", ".doc"];

export default function DocxToPdf() {
  const [file, setFile]           = useState<File | null>(null);
  const [loading, setLoading]     = useState(false);
  const [rendered, setRendered]   = useState(false);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress]   = useState(0);          // 0–100
  const [error, setError]         = useState<string | null>(null);

  // Always-mounted container — ref is never null after first render
  const containerRef = useRef<HTMLDivElement>(null);

  // ── File selection ────────────────────────────────────────────────────────

  const selectFile = (f: File) => {
    setFile(f);
    setRendered(false);
    setError(null);
    setProgress(0);
    if (containerRef.current) containerRef.current.innerHTML = "";
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

  // ── Step 1: Render DOCX → HTML preview ───────────────────────────────────

  const handleRender = useCallback(async () => {
    if (!file) return;
    const container = containerRef.current;
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
        ignoreHeight: false,
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

  // ── Step 2: Convert rendered HTML → PDF via html2canvas + jspdf ──────────

  /**
   * Recursively replace modern CSS color functions (lab/oklab/lch/oklch)
   * that html2canvas doesn't support with a neutral fallback color.
   * These are used by some DOCX themes for subtle tints.
   */
  function sanitizeColors(el: HTMLElement) {
    const MODERN_COLOR_RE = /(?:lab|oklab|lch|oklch|color)\s*\([^)]+\)/gi;
    // Walk inline styles
    const all = el.querySelectorAll<HTMLElement>("*");
    all.forEach(child => {
      const style = child.getAttribute("style");
      if (style && MODERN_COLOR_RE.test(style)) {
        child.setAttribute("style", style.replace(MODERN_COLOR_RE, "#000000"));
      }
      // Also patch color/background-color computed inline
      if (child.style.color && MODERN_COLOR_RE.test(child.style.color)) {
        child.style.color = "#000000";
      }
      if (child.style.backgroundColor && MODERN_COLOR_RE.test(child.style.backgroundColor)) {
        child.style.backgroundColor = "transparent";
      }
    });
    // Walk stylesheets inside the element's shadow or injected <style> tags
    const styleTags = el.querySelectorAll<HTMLStyleElement>("style");
    styleTags.forEach(st => {
      if (MODERN_COLOR_RE.test(st.textContent ?? "")) {
        st.textContent = (st.textContent ?? "").replace(MODERN_COLOR_RE, "#000000");
      }
    });
  }

  const handleDownloadPdf = useCallback(async () => {
    const container = containerRef.current;
    if (!container || !rendered || !file) return;

    setConverting(true);
    setProgress(0);
    setError(null);

    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      const A4_W_MM     = 210;
      const A4_H_MM     = 297;
      const MARGIN_MM   = 10;
      const CONTENT_W_MM = A4_W_MM - MARGIN_MM * 2;

      // Sanitize modern CSS colors before capturing
      sanitizeColors(container);

      const pages = Array.from(
        container.querySelectorAll<HTMLElement>(".docx-wrapper > section, .docx-wrapper .docx")
      );
      const targets: HTMLElement[] = pages.length > 0 ? pages : [container];

      const pdf   = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
      let isFirst = true;

      for (let i = 0; i < targets.length; i++) {
        const target = targets[i];
        setProgress(Math.round((i / targets.length) * 90));

        const canvas = await html2canvas(target, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          logging: false,
          height: target.scrollHeight,
          windowHeight: target.scrollHeight,
          // Sanitize on the cloned DOM too (html2canvas clones before rendering)
          onclone: (_doc, clonedEl) => {
            sanitizeColors(clonedEl);
          },
        });

        const imgData  = canvas.toDataURL("image/jpeg", 0.92);
        const canvasW  = canvas.width;
        const canvasH  = canvas.height;
        const imgW_mm  = CONTENT_W_MM;
        const imgH_mm  = (canvasH / canvasW) * imgW_mm;

        const pageContentH = A4_H_MM - MARGIN_MM * 2;
        const totalPages   = Math.ceil(imgH_mm / pageContentH);

        for (let p = 0; p < totalPages; p++) {
          if (!isFirst) pdf.addPage();
          isFirst = false;

          const sliceTop_mm = p * pageContentH;
          const sliceH_mm   = Math.min(pageContentH, imgH_mm - sliceTop_mm);
          const px_per_mm   = canvasW / imgW_mm;
          const srcY        = Math.round(sliceTop_mm * px_per_mm);
          const srcH        = Math.round(sliceH_mm   * px_per_mm);

          const slice = document.createElement("canvas");
          slice.width  = canvasW;
          slice.height = srcH;
          const ctx = slice.getContext("2d")!;
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, slice.width, slice.height);
          ctx.drawImage(canvas, 0, srcY, canvasW, srcH, 0, 0, canvasW, srcH);

          const sliceData = slice.toDataURL("image/jpeg", 0.92);
          pdf.addImage(sliceData, "JPEG", MARGIN_MM, MARGIN_MM, imgW_mm, sliceH_mm);
        }
      }

      setProgress(100);
      const pdfBlob  = pdf.output("blob");
      const fileName = file.name.replace(/\.docx?$/i, ".pdf");
      triggerDownload(pdfBlob, fileName);

    } catch (e) {
      setError(
        `Conversion failed: ${e instanceof Error ? e.message : "Unknown error"}.`
      );
    } finally {
      setConverting(false);
      setProgress(0);
    }
  }, [file, rendered]);

  const reset = () => {
    setFile(null); setRendered(false); setError(null); setProgress(0);
    if (containerRef.current) containerRef.current.innerHTML = "";
  };

  // ── UI ────────────────────────────────────────────────────────────────────

  return (
    <div className="w-full space-y-5">

      {/* Drop zone */}
      {!file && (
        <label
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          className="relative flex flex-col items-center justify-center w-full min-h-[220px]
                     rounded-2xl border-2 border-dashed border-slate-300 cursor-pointer
                     bg-gradient-to-b from-slate-50 to-white
                     hover:border-indigo-400 hover:bg-indigo-50/30 transition-all duration-300"
        >
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

      {/* Step 1 button: Preview */}
      {file && !rendered && !loading && !error && (
        <button onClick={handleRender}
          className="w-full flex items-center justify-center gap-2.5
                     py-4 rounded-2xl font-semibold text-white text-base
                     bg-gradient-to-r from-blue-700 to-blue-500
                     hover:from-blue-600 hover:to-blue-400
                     shadow-[0_4px_20px_rgba(59,130,246,0.35)]
                     hover:-translate-y-0.5 transition-all duration-200">
          <Eye className="w-5 h-5" />
          Step 1 — Preview Document
        </button>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-8 gap-2.5 text-sm text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
          Rendering document…
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

      {/* Step 2 button: Download PDF — real download, no print dialog */}
      {rendered && !converting && (
        <button onClick={handleDownloadPdf}
          className="w-full flex items-center justify-center gap-2.5
                     py-4 rounded-2xl font-semibold text-white text-base
                     bg-gradient-to-r from-slate-900 via-indigo-700 to-indigo-600
                     hover:from-slate-800 hover:via-indigo-600 hover:to-indigo-500
                     shadow-[0_4px_20px_rgba(79,70,229,0.4)]
                     hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200">
          <Download className="w-5 h-5" />
          Step 2 — Download PDF
        </button>
      )}

      {/* Conversion progress */}
      {converting && (
        <div className="space-y-3">
          <div className="flex justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-500" />
              Converting to PDF…
            </span>
            <span className="font-mono font-semibold text-indigo-600">{progress}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 text-center">
            Rendering pages to canvas — this may take a moment for long documents…
          </p>
        </div>
      )}

      {/* Always-mounted preview container */}
      <div
        className={`rounded-2xl overflow-hidden border border-slate-200 shadow-sm transition-all ${
          !file || (!rendered && !loading) ? "hidden" : ""
        }`}
      >
        {(rendered || loading) && (
          <div className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-900">
            <Eye className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
              {loading ? "Rendering…" : "Document Preview — scroll to review"}
            </span>
            {rendered && (
              <span className="ml-auto text-xs text-slate-500">Review then click Download PDF above</span>
            )}
          </div>
        )}
        <div
          ref={containerRef}
          className="bg-slate-100 max-h-[600px] overflow-y-auto"
        />
      </div>
    </div>
  );
}

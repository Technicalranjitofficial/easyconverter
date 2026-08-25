"use client";

import { useState, useCallback, useRef } from "react";
import {
  Loader2, FileText, Eye, Printer,
  RotateCcw, AlertCircle, CheckCircle2,
} from "lucide-react";
import { formatBytes } from "@/lib/utils/fileUtils";

const ACCEPTED_EXT = [".docx", ".doc"];

const PRINT_CSS = `
  @page { size: A4; margin: 18mm 20mm; }
  * { box-sizing: border-box; }
  body { margin: 0; padding: 0; background: #fff; font-family: Calibri, Arial, sans-serif; }
  .docx-wrapper { background: none !important; padding: 0 !important; }
  .docx {
    width: 100% !important;
    min-height: auto !important;
    padding: 0 !important;
    box-shadow: none !important;
    margin: 0 !important;
  }
  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    * { box-shadow: none !important; }
  }
`;

export default function DocxToPdf() {
  const [file, setFile]         = useState<File | null>(null);
  const [loading, setLoading]   = useState(false);
  const [rendered, setRendered] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [error, setError]       = useState<string | null>(null);

  // Always-mounted preview div
  const previewRef = useRef<HTMLDivElement>(null);

  // ── File selection ──────────────────────────────────────────────────────────
  const selectFile = (f: File) => {
    setFile(f); setRendered(false); setError(null);
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

  // ── Step 1: Render preview ──────────────────────────────────────────────────
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

  // ── Step 2: Print to PDF ────────────────────────────────────────────────────
  // The browser's native print-to-PDF produces perfect vector output —
  // text, tables, borders all pixel-perfect. The user picks "Save as PDF"
  // in the print dialog (same as Ctrl+P → Save as PDF in Chrome).
  const handlePrint = useCallback(() => {
    const container = previewRef.current;
    if (!container || !rendered) return;
    setPrinting(true);

    const iframe = document.createElement("iframe");
    iframe.style.cssText = "position:fixed;top:-9999px;left:-9999px;width:210mm;height:297mm;border:none;visibility:hidden;";
    document.body.appendChild(iframe);

    const iDoc = iframe.contentDocument ?? iframe.contentWindow?.document;
    if (!iDoc) { setPrinting(false); return; }

    const docName = file?.name?.replace(/\.docx?$/i, "") ?? "document";
    iDoc.open();
    iDoc.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${docName}</title>
  <style>${PRINT_CSS}</style>
</head>
<body>${container.innerHTML}</body>
</html>`);
    iDoc.close();

    const doPrint = () => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => {
        if (document.body.contains(iframe)) document.body.removeChild(iframe);
        setPrinting(false);
      }, 1500);
    };

    if (iDoc.readyState === "complete") {
      setTimeout(doPrint, 500);
    } else {
      iframe.onload = () => setTimeout(doPrint, 500);
      setTimeout(() => {
        if (document.body.contains(iframe)) doPrint();
      }, 2500);
    }
  }, [file, rendered]);

  const reset = () => {
    setFile(null); setRendered(false); setError(null);
    if (previewRef.current) previewRef.current.innerHTML = "";
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="w-full space-y-5">

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
              {rendered && !printing && (
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

      {/* Step 1: Preview */}
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
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-700">Rendering failed</p>
            <p className="text-xs text-red-600 mt-0.5 leading-relaxed">{error}</p>
            <p className="text-xs text-red-500 mt-1">
              Ensure the file is a valid .docx (Word 2007+) file.
            </p>
            <button onClick={handleRender}
              className="mt-2 text-xs font-semibold text-red-600 underline hover:text-red-800">
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Save as PDF */}
      {rendered && !printing && (
        <>
          {/* How-to tip */}
          <div className="flex items-start gap-2.5 p-3 bg-indigo-50 rounded-xl border border-indigo-200">
            <Printer className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-indigo-700 leading-relaxed">
              Click <strong>Save as PDF</strong> below. In the print dialog that opens, set the
              destination to <strong>&quot;Save as PDF&quot;</strong> and margins to
              <strong> None</strong> for the best result.
            </p>
          </div>

          <button onClick={handlePrint}
            className="w-full flex items-center justify-center gap-2.5
                       py-4 rounded-2xl font-semibold text-white text-base
                       bg-gradient-to-r from-slate-900 via-indigo-700 to-indigo-600
                       hover:from-slate-800 hover:via-indigo-600 hover:to-indigo-500
                       shadow-[0_4px_20px_rgba(79,70,229,0.4)]
                       hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200">
            <Printer className="w-5 h-5" />Step 2 — Save as PDF
          </button>
        </>
      )}

      {printing && (
        <div className="flex items-center justify-center py-4 gap-2.5 text-sm text-slate-500">
          <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />Opening print dialog…
        </div>
      )}

      {/* Always-mounted preview container */}
      <div className={`rounded-2xl overflow-hidden border border-slate-200 shadow-sm ${!file || (!rendered && !loading) ? "hidden" : ""}`}>
        {(rendered || loading) && (
          <div className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-900">
            <Eye className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
              {loading ? "Rendering…" : "Document Preview"}
            </span>
            {rendered && (
              <span className="ml-auto text-xs text-slate-500">Review, then click Save as PDF</span>
            )}
          </div>
        )}
        <div ref={previewRef} className="bg-slate-100 max-h-[600px] overflow-y-auto" />
      </div>
    </div>
  );
}

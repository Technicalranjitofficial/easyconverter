"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Loader2, FileText, Eye, Download, RotateCcw, AlertCircle, CheckCircle2 } from "lucide-react";
import { formatBytes } from "@/lib/utils/fileUtils";

const ACCEPTED = [
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
];

// The PDF print stylesheet injected into the preview iframe
const PRINT_STYLES = `
  @page {
    size: A4;
    margin: 20mm 25mm;
  }
  body {
    font-family: 'Times New Roman', serif;
    font-size: 12pt;
    line-height: 1.5;
    color: #000;
    background: #fff;
  }
  .docx-wrapper {
    background: none !important;
    padding: 0 !important;
  }
  .docx {
    width: 100% !important;
    min-height: auto !important;
    padding: 0 !important;
    box-shadow: none !important;
  }
  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    * { box-shadow: none !important; }
  }
`;

export default function DocxToPdf() {
  const [file, setFile]             = useState<File | null>(null);
  const [loading, setLoading]       = useState(false);
  const [rendered, setRendered]     = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [printing, setPrinting]     = useState(false);
  const containerRef                = useRef<HTMLDivElement>(null);
  const styleInjectedRef            = useRef(false);

  const handleFile = useCallback((files: File[]) => {
    const f = files[0]; if (!f) return;
    setFile(f); setRendered(false); setError(null);
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = Array.from(e.dataTransfer.files).find(f => ACCEPTED.includes(f.type) || f.name.endsWith(".docx") || f.name.endsWith(".doc"));
    if (f) { handleFile([f]); }
  };

  // Render the DOCX preview into the container div
  const handleRender = useCallback(async () => {
    if (!file || !containerRef.current) return;
    setLoading(true);
    setError(null);
    try {
      const { renderAsync } = await import("docx-preview");
      const buf = await file.arrayBuffer();
      containerRef.current.innerHTML = "";
      await renderAsync(buf, containerRef.current, undefined, {
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
      setError(e instanceof Error ? e.message : "Failed to render document. Make sure it's a valid .docx file.");
    } finally {
      setLoading(false);
    }
  }, [file]);

  // Auto-render when file is selected
  useEffect(() => {
    if (file) handleRender();
  }, [file, handleRender]);

  // Print to PDF using a hidden iframe (preserves document formatting)
  const handleSaveAsPdf = useCallback(() => {
    if (!containerRef.current || !rendered) return;
    setPrinting(true);

    const iframe = document.createElement("iframe");
    iframe.style.cssText = "position:fixed;top:-9999px;left:-9999px;width:210mm;height:297mm;border:none;";
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentDocument ?? iframe.contentWindow?.document;
    if (!iframeDoc) { setPrinting(false); return; }

    iframeDoc.open();
    iframeDoc.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${file?.name?.replace(/\.docx?$/i, "") ?? "document"}</title>
  <style>${PRINT_STYLES}</style>
</head>
<body>
  ${containerRef.current.innerHTML}
</body>
</html>`);
    iframeDoc.close();

    // Wait for images etc. to load then print
    iframe.onload = () => {
      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        setTimeout(() => {
          document.body.removeChild(iframe);
          setPrinting(false);
        }, 1000);
      }, 500);
    };

    // Fallback if onload doesn't fire
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        setTimeout(() => {
          if (document.body.contains(iframe)) document.body.removeChild(iframe);
          setPrinting(false);
        }, 1000);
      }
    }, 2000);
  }, [file, rendered]);

  const reset = () => {
    setFile(null); setRendered(false); setError(null);
    if (containerRef.current) containerRef.current.innerHTML = "";
    styleInjectedRef.current = false;
  };

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
          <input
            type="file"
            accept=".docx,.doc"
            onChange={e => {
              const f = e.target.files?.[0];
              if (f) handleFile([f]);
              e.target.value = "";
            }}
            className="sr-only"
          />
          <div className="flex flex-col items-center gap-3 p-8 text-center pointer-events-none">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
              <FileText className="w-7 h-7 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-1">Drop your Word document here</p>
              <p className="text-xs text-slate-400">or click to browse</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
              <span className="px-2 py-1 rounded-md bg-slate-100 font-mono">.docx</span>
              <span className="px-2 py-1 rounded-md bg-slate-100 font-mono">.doc</span>
              <span>· Max 20 MB</span>
            </div>
          </div>
        </label>
      )}

      {/* File badge + actions */}
      {file && (
        <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
            <FileText className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-700 truncate">{file.name}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-xs text-slate-400">{formatBytes(file.size)}</p>
              {rendered && (
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                  <CheckCircle2 className="w-3 h-3" /> Preview ready
                </span>
              )}
            </div>
          </div>
          <button onClick={reset}
            className="text-slate-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-10 gap-2.5 text-sm text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
          Rendering document preview…
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-700">Rendering failed</p>
            <p className="text-xs text-red-600 mt-0.5">{error}</p>
            <p className="text-xs text-red-500 mt-1">Make sure the file is a valid .docx (Word 2007+) file.</p>
          </div>
        </div>
      )}

      {/* Info banner */}
      {rendered && (
        <div className="flex items-start gap-2.5 p-3 bg-amber-50 rounded-xl border border-amber-200">
          <Eye className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 leading-relaxed">
            <strong>Preview shown below.</strong> Click <strong>Save as PDF</strong> — your browser's print dialog will open. Choose <strong>"Save as PDF"</strong> as the destination. Set margins to <strong>None</strong> or <strong>Minimum</strong> for best results.
          </p>
        </div>
      )}

      {/* Save as PDF button */}
      {rendered && (
        <button
          onClick={handleSaveAsPdf}
          disabled={printing}
          className="w-full flex items-center justify-center gap-2.5
                     py-4 rounded-2xl font-semibold text-white text-base
                     bg-gradient-to-r from-slate-900 via-indigo-700 to-indigo-600
                     hover:from-slate-800 hover:via-indigo-600 hover:to-indigo-500
                     disabled:opacity-60 disabled:cursor-not-allowed
                     shadow-[0_4px_20px_rgba(79,70,229,0.4)]
                     hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
        >
          {printing
            ? <><Loader2 className="w-5 h-5 animate-spin" />Opening print dialog…</>
            : <><Download className="w-5 h-5" />Save as PDF</>
          }
        </button>
      )}

      {/* Live DOCX preview */}
      {file && !loading && !error && (
        <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-900">
            <Eye className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
              {rendered ? "Document Preview" : "Rendering…"}
            </span>
            {rendered && (
              <span className="ml-auto text-xs text-slate-500">Scroll to review before saving</span>
            )}
          </div>

          {/* docx-preview renders into this div */}
          <div
            ref={containerRef}
            className="bg-slate-100 max-h-[600px] overflow-y-auto p-4"
            style={{ minHeight: rendered ? 200 : 0 }}
          />
        </div>
      )}
    </div>
  );
}

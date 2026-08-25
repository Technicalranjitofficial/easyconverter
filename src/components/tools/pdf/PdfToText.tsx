"use client";

import { useState, useCallback } from "react";
import { Loader2, Copy, Check, Download, RotateCcw, FileText, Type } from "lucide-react";
import PdfDropZone from "./PdfDropZone";
import { pdfToText, type PdfTextResult } from "@/lib/converters/pdfConverter";
import { formatBytes } from "@/lib/utils/fileUtils";
import { triggerDownload } from "@/lib/utils/downloadUtils";

export default function PdfToText() {
  const [file, setFile]         = useState<File | null>(null);
  const [loading, setLoading]   = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [result, setResult]     = useState<PdfTextResult | null>(null);
  const [copied, setCopied]     = useState(false);
  const [viewMode, setViewMode] = useState<"all" | "page">("all");
  const [currentPage, setCurrentPage] = useState(0);

  const handleFile = useCallback((files: File[]) => {
    const f = files[0]; if (!f) return;
    setFile(f); setResult(null); setProgress({ done: 0, total: 0 });
  }, []);

  const handleExtract = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const r = await pdfToText(file, (done, total) => setProgress({ done, total }));
      setResult(r);
    } catch (e) {
      alert(`Extraction failed: ${e instanceof Error ? e.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    const text = viewMode === "all" ? result.text : result.pageTexts[currentPage];
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleDownload = () => {
    if (!result) return;
    const text = result.text;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    triggerDownload(blob, result.fileName.replace(/\.pdf$/i, ".txt"));
  };

  const reset = () => { setFile(null); setResult(null); };

  const displayText = result
    ? (viewMode === "all" ? result.text : result.pageTexts[currentPage] ?? "")
    : "";

  const wordCount = displayText.trim() ? displayText.trim().split(/\s+/).length : 0;
  const charCount = displayText.length;

  return (
    <div className="w-full space-y-5">
      {!file && <PdfDropZone onFilesAdded={handleFile} multiple={false} />}

      {file && !result && (
        <>
          <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white">
            <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
              <FileText className="w-4 h-4 text-red-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700 truncate">{file.name}</p>
              <p className="text-xs text-slate-400">{formatBytes(file.size)}</p>
            </div>
          </div>

          {loading && progress.total > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Extracting page {progress.done} of {progress.total}…</span>
                <span>{Math.round((progress.done / progress.total) * 100)}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                     style={{ width: `${(progress.done / progress.total) * 100}%` }} />
              </div>
            </div>
          )}

          <button onClick={handleExtract} disabled={loading}
            className="w-full flex items-center justify-center gap-2.5
                       py-4 rounded-2xl font-semibold text-white text-base
                       bg-gradient-to-r from-slate-900 via-indigo-700 to-indigo-600
                       hover:from-slate-800 hover:via-indigo-600 hover:to-indigo-500
                       disabled:opacity-60 shadow-[0_4px_20px_rgba(79,70,229,0.4)]
                       hover:-translate-y-0.5 transition-all duration-200">
            {loading
              ? <><Loader2 className="w-5 h-5 animate-spin" />Extracting text…</>
              : <><Type className="w-5 h-5" />Extract Text</>
            }
          </button>
        </>
      )}

      {result && (
        <div className="space-y-4 animate-slide-up">
          {/* Header */}
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-900">
              <Type className="w-4 h-4 text-indigo-400" />
              <p className="text-sm font-semibold text-white">{result.fileName}</p>
              <span className="ml-auto text-xs text-slate-400">
                {result.pageCount} pages · {wordCount.toLocaleString()} words · {charCount.toLocaleString()} chars
              </span>
            </div>

            {/* View mode */}
            <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-50 border-b border-slate-100">
              <div className="flex rounded-lg overflow-hidden border border-slate-200 divide-x divide-slate-200">
                <button onClick={() => setViewMode("all")}
                  className={`px-3 py-1.5 text-xs font-semibold transition-all ${viewMode === "all" ? "bg-slate-900 text-white" : "bg-white text-slate-500 hover:bg-slate-50"}`}>
                  All Pages
                </button>
                <button onClick={() => setViewMode("page")}
                  className={`px-3 py-1.5 text-xs font-semibold transition-all ${viewMode === "page" ? "bg-slate-900 text-white" : "bg-white text-slate-500 hover:bg-slate-50"}`}>
                  By Page
                </button>
              </div>
              {viewMode === "page" && (
                <div className="flex items-center gap-2">
                  <button onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                    disabled={currentPage === 0}
                    className="w-7 h-7 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40 transition-colors text-xs font-bold">
                    ‹
                  </button>
                  <span className="text-xs text-slate-600 font-medium">
                    Page {currentPage + 1} of {result.pageCount}
                  </span>
                  <button onClick={() => setCurrentPage(p => Math.min(result.pageCount - 1, p + 1))}
                    disabled={currentPage === result.pageCount - 1}
                    className="w-7 h-7 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40 transition-colors text-xs font-bold">
                    ›
                  </button>
                </div>
              )}
              <div className="ml-auto flex gap-2">
                <button onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors">
                  {copied ? <><Check className="w-3.5 h-3.5 text-emerald-400" />Copied!</> : <><Copy className="w-3.5 h-3.5" />Copy</>}
                </button>
                <button onClick={handleDownload}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors">
                  <Download className="w-3.5 h-3.5" />Download .txt
                </button>
              </div>
            </div>

            {/* Text area */}
            <textarea
              readOnly
              value={displayText || "(No text found on this page)"}
              rows={16}
              className="w-full px-4 py-3 text-sm text-slate-700 font-mono leading-relaxed
                         bg-white resize-none focus:outline-none"
            />
          </div>

          <button onClick={reset}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold
                       text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
            <RotateCcw className="w-4 h-4" />Extract from Another PDF
          </button>
        </div>
      )}
    </div>
  );
}

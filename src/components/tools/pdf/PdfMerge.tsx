"use client";

import { useState, useCallback } from "react";
import { Loader2, Merge, X, Download, RotateCcw, FileText, ChevronDown, ChevronUp } from "lucide-react";
import PdfDropZone from "./PdfDropZone";
import PdfPagePreview from "./PdfPagePreview";
import { mergePdfs } from "@/lib/converters/pdfConverter";
import { formatBytes } from "@/lib/utils/fileUtils";
import { triggerDownload } from "@/lib/utils/downloadUtils";

interface PdfEntry {
  id: string;
  file: File;
  pageCount: number;
  expanded: boolean;
}

export default function PdfMerge() {
  const [entries, setEntries]   = useState<PdfEntry[]>([]);
  const [dragIdx, setDragIdx]   = useState<number | null>(null);
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState<{ blob: Blob; size: number; pages: number } | null>(null);

  const addFiles = useCallback((files: File[]) => {
    setEntries(prev => [
      ...prev,
      ...files.map(f => ({
        id: `${f.name}-${f.lastModified}-${Math.random()}`,
        file: f,
        pageCount: 0,
        expanded: false,
      })),
    ]);
    setResult(null);
  }, []);

  const setPageCount = (id: string, count: number) =>
    setEntries(prev => prev.map(e => e.id === id ? { ...e, pageCount: count } : e));

  const toggleExpand = (id: string) =>
    setEntries(prev => prev.map(e => e.id === id ? { ...e, expanded: !e.expanded } : e));

  const remove = (id: string) => setEntries(prev => prev.filter(e => e.id !== id));

  // File-level drag-to-reorder
  const handleDragStart = (i: number) => setDragIdx(i);
  const handleDragOver  = (e: React.DragEvent, i: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === i) return;
    setEntries(prev => {
      const next = [...prev];
      const [item] = next.splice(dragIdx, 1);
      next.splice(i, 0, item);
      return next;
    });
    setDragIdx(i);
  };

  const handleMerge = async () => {
    if (entries.length < 2) return;
    setLoading(true);
    try {
      const r = await mergePdfs(entries.map(e => e.file));
      setResult({ blob: r.blob, size: r.resultSize, pages: r.pageCount });
    } catch { alert("Merge failed. Ensure all files are valid, unlocked PDFs."); }
    finally { setLoading(false); }
  };

  const reset = () => { setEntries([]); setResult(null); };
  const totalSize = entries.reduce((s, e) => s + e.file.size, 0);

  return (
    <div className="w-full space-y-5">
      {!result && <PdfDropZone onFilesAdded={addFiles} multiple disabled={loading} />}

      {entries.length > 0 && !result && (
        <div className="space-y-3">
          {/* File list with per-file thumbnail expand */}
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
                  {entries.length} file{entries.length !== 1 ? "s" : ""} · {formatBytes(totalSize)} · drag to reorder
                </span>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {entries.map((entry, i) => (
                <div
                  key={entry.id}
                  draggable
                  onDragStart={() => handleDragStart(i)}
                  onDragOver={e => handleDragOver(e, i)}
                  onDragEnd={() => setDragIdx(null)}
                  className={`bg-white transition-opacity ${dragIdx === i ? "opacity-40" : ""}`}
                >
                  {/* File row */}
                  <div className="flex items-center gap-3 px-4 py-3 select-none cursor-grab active:cursor-grabbing">
                    {/* Order number */}
                    <span className="text-xs font-bold text-slate-400 w-5 text-center flex-shrink-0">{i + 1}</span>

                    <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-red-500" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">{entry.file.name}</p>
                      <p className="text-xs text-slate-400">
                        {formatBytes(entry.file.size)}
                        {entry.pageCount > 0 && ` · ${entry.pageCount} page${entry.pageCount !== 1 ? "s" : ""}`}
                      </p>
                    </div>

                    {/* Expand thumbnails */}
                    <button
                      onClick={() => toggleExpand(entry.id)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium
                                 text-slate-500 hover:bg-slate-100 transition-colors flex-shrink-0"
                    >
                      {entry.expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      {entry.expanded ? "Hide" : "Preview"}
                    </button>

                    <button
                      onClick={() => remove(entry.id)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-red-500 transition-colors flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Page thumbnail preview (expandable) */}
                  {entry.expanded && (
                    <div className="px-4 pb-4">
                      <PdfPagePreview
                        file={entry.file}
                        selectionMode="none"
                        showLabel
                        onLoaded={thumbs => setPageCount(entry.id, thumbs.length)}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Merge button */}
          {entries.length >= 2 ? (
            <button
              onClick={handleMerge}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2.5
                         py-4 rounded-2xl font-semibold text-white text-base
                         bg-gradient-to-r from-slate-900 via-indigo-700 to-indigo-600
                         hover:from-slate-800 hover:via-indigo-600 hover:to-indigo-500
                         disabled:opacity-60 disabled:cursor-not-allowed
                         shadow-[0_4px_20px_rgba(79,70,229,0.4)]
                         hover:-translate-y-0.5 transition-all duration-200"
            >
              {loading
                ? <><Loader2 className="w-5 h-5 animate-spin" />Merging…</>
                : <><Merge className="w-5 h-5" />Merge {entries.length} PDFs</>
              }
            </button>
          ) : (
            <p className="text-center text-sm text-slate-400">Add at least 2 PDF files to merge.</p>
          )}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="rounded-2xl overflow-hidden border border-emerald-200 shadow-sm animate-slide-up">
          <div className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-900">
            <Merge className="w-4 h-4 text-emerald-400" />
            <p className="text-sm font-semibold text-white">Merged successfully</p>
            <span className="ml-auto text-xs text-slate-400 font-mono">
              {result.pages} pages · {formatBytes(result.size)}
            </span>
          </div>
          <div className="flex gap-3 p-4 bg-emerald-50">
            <button
              onClick={() => triggerDownload(result.blob, "merged.pdf")}
              className="flex-1 flex items-center justify-center gap-2
                         py-3 rounded-xl font-semibold text-white text-sm
                         bg-gradient-to-r from-slate-900 via-indigo-700 to-indigo-600
                         hover:-translate-y-0.5 transition-all"
            >
              <Download className="w-4 h-4" />Download Merged PDF
            </button>
            <button onClick={reset}
              className="flex items-center gap-2 py-3 px-5 rounded-xl text-sm font-semibold
                         text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-all">
              <RotateCcw className="w-4 h-4" />Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

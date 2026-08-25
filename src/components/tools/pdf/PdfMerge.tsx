"use client";

import { useState, useCallback } from "react";
import { Loader2, Merge, X, GripVertical, Download, RotateCcw, FileText } from "lucide-react";
import PdfDropZone from "./PdfDropZone";
import { mergePdfs } from "@/lib/converters/pdfConverter";
import { formatBytes } from "@/lib/utils/fileUtils";
import { triggerDownload } from "@/lib/utils/downloadUtils";

interface PdfFile { id: string; file: File; }

export default function PdfMerge() {
  const [files, setFiles]     = useState<PdfFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState<{ blob: Blob; size: number; pages: number } | null>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const addFiles = useCallback((incoming: File[]) => {
    setFiles(prev => [
      ...prev,
      ...incoming.map(f => ({ id: `${f.name}-${f.lastModified}-${Math.random()}`, file: f })),
    ]);
    setResult(null);
  }, []);

  const remove = (id: string) => setFiles(prev => prev.filter(f => f.id !== id));

  // Drag-to-reorder
  const handleDragStart = (i: number) => setDragIdx(i);
  const handleDragOver  = (e: React.DragEvent, i: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === i) return;
    setFiles(prev => {
      const next = [...prev];
      const [item] = next.splice(dragIdx, 1);
      next.splice(i, 0, item);
      return next;
    });
    setDragIdx(i);
  };

  const handleMerge = async () => {
    if (files.length < 2) return;
    setLoading(true);
    try {
      const r = await mergePdfs(files.map(f => f.file));
      setResult({ blob: r.blob, size: r.resultSize, pages: r.pageCount });
    } catch { alert("Failed to merge PDFs. Ensure all files are valid, unlocked PDFs."); }
    finally { setLoading(false); }
  };

  const reset = () => { setFiles([]); setResult(null); };

  const totalSize = files.reduce((s, f) => s + f.file.size, 0);

  return (
    <div className="w-full space-y-5">
      {!result && (
        <PdfDropZone onFilesAdded={addFiles} multiple disabled={loading} />
      )}

      {files.length > 0 && !result && (
        <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
                {files.length} file{files.length !== 1 ? "s" : ""} · {formatBytes(totalSize)} total
              </span>
            </div>
            <span className="text-xs text-slate-500">Drag to reorder</span>
          </div>

          <div className="divide-y divide-slate-100">
            {files.map((pf, i) => (
              <div
                key={pf.id}
                draggable
                onDragStart={() => handleDragStart(i)}
                onDragOver={e => handleDragOver(e, i)}
                onDragEnd={() => setDragIdx(null)}
                className={`flex items-center gap-3 px-4 py-3 bg-white hover:bg-slate-50 transition-colors
                            cursor-grab active:cursor-grabbing select-none
                            ${dragIdx === i ? "opacity-50 bg-indigo-50" : ""}`}
              >
                <GripVertical className="w-4 h-4 text-slate-300 flex-shrink-0" />
                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">{pf.file.name}</p>
                  <p className="text-xs text-slate-400">{formatBytes(pf.file.size)}</p>
                </div>
                <span className="text-xs text-slate-300 font-mono w-5 text-center flex-shrink-0">{i + 1}</span>
                <button onClick={() => remove(pf.id)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-red-500 transition-colors flex-shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {files.length >= 2 && !result && (
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
            ? <><Loader2 className="w-5 h-5 animate-spin" />Merging {files.length} PDFs…</>
            : <><Merge className="w-5 h-5" />Merge {files.length} PDFs</>
          }
        </button>
      )}

      {files.length < 2 && files.length > 0 && !result && (
        <p className="text-center text-sm text-slate-400">Add at least 2 PDF files to merge.</p>
      )}

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
              <Download className="w-4 h-4" /> Download Merged PDF
            </button>
            <button onClick={reset}
              className="flex items-center gap-2 py-3 px-5 rounded-xl text-sm font-semibold
                         text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-all">
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

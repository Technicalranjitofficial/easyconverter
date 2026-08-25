"use client";

import { useState, useCallback } from "react";
import { Loader2, FileText, X, GripVertical, Download, RotateCcw, ImageIcon } from "lucide-react";
import { imagesToPdf, type PdfPageSize, type PdfOrientation } from "@/lib/converters/pdfConverter";
import { formatBytes } from "@/lib/utils/fileUtils";
import { triggerDownload } from "@/lib/utils/downloadUtils";

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

interface ImageEntry {
  id: string;
  file: File;
  previewUrl: string;
}

const PAGE_SIZES: { value: PdfPageSize; label: string; desc: string }[] = [
  { value: "a4",     label: "A4",         desc: "210 × 297 mm" },
  { value: "letter", label: "US Letter",  desc: "8.5 × 11 in"  },
  { value: "fit",    label: "Fit to Image", desc: "Page = image size" },
];

export default function PdfImageToPdf() {
  const [entries, setEntries]   = useState<ImageEntry[]>([]);
  const [pageSize, setPageSize] = useState<PdfPageSize>("a4");
  const [orient, setOrient]     = useState<PdfOrientation>("portrait");
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState<{ blob: Blob; size: number; pages: number } | null>(null);
  const [dragIdx, setDragIdx]   = useState<number | null>(null);

  const addFiles = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).filter(f => ACCEPTED.includes(f.type));
    setEntries(prev => [
      ...prev,
      ...files.map(f => ({
        id: `${f.name}-${f.lastModified}-${Math.random()}`,
        file: f,
        previewUrl: URL.createObjectURL(f),
      })),
    ]);
    setResult(null);
    e.target.value = "";
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(f => ACCEPTED.includes(f.type));
    setEntries(prev => [
      ...prev,
      ...files.map(f => ({
        id: `${f.name}-${f.lastModified}-${Math.random()}`,
        file: f,
        previewUrl: URL.createObjectURL(f),
      })),
    ]);
    setResult(null);
  }, []);

  const remove = (id: string) => {
    setEntries(prev => {
      const entry = prev.find(e => e.id === id);
      if (entry) URL.revokeObjectURL(entry.previewUrl);
      return prev.filter(e => e.id !== id);
    });
  };

  // Drag-to-reorder
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

  const handleConvert = async () => {
    if (!entries.length) return;
    setLoading(true);
    try {
      const r = await imagesToPdf(entries.map(e => e.file), { pageSize, orientation: orient });
      setResult({ blob: r.blob, size: r.resultSize, pages: r.pageCount });
    } catch (err) {
      alert(`Conversion failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    entries.forEach(e => URL.revokeObjectURL(e.previewUrl));
    setEntries([]); setResult(null);
  };

  const totalSize = entries.reduce((s, e) => s + e.file.size, 0);

  return (
    <div className="w-full space-y-5">
      {/* Drop zone */}
      {!result && (
        <label
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          className="relative flex flex-col items-center justify-center w-full min-h-[180px]
                     rounded-2xl border-2 border-dashed border-slate-300 cursor-pointer
                     bg-gradient-to-b from-slate-50 to-white
                     hover:border-indigo-400 hover:bg-indigo-50/30 transition-all duration-300"
        >
          <input type="file" accept={ACCEPTED.join(",")} multiple onChange={addFiles} className="sr-only" />
          <div className="flex flex-col items-center gap-2 p-6 text-center pointer-events-none">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-indigo-500" />
            </div>
            <p className="text-sm font-semibold text-slate-700">Drop images here or click to browse</p>
            <p className="text-xs text-slate-400">JPG, PNG, WebP · Up to 30 images</p>
          </div>
        </label>
      )}

      {entries.length > 0 && !result && (
        <>
          {/* Settings */}
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
            <div className="px-4 py-2.5 bg-slate-900 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">PDF Settings</span>
            </div>
            <div className="p-4 bg-white space-y-3">
              {/* Page size */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Page Size</p>
                <div className="grid grid-cols-3 gap-2">
                  {PAGE_SIZES.map(s => (
                    <button key={s.value} onClick={() => setPageSize(s.value)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        pageSize === s.value ? "border-indigo-400 bg-indigo-50" : "border-slate-200 hover:border-slate-300"
                      }`}>
                      <p className={`text-xs font-bold mb-0.5 ${pageSize === s.value ? "text-indigo-700" : "text-slate-700"}`}>{s.label}</p>
                      <p className="text-[11px] text-slate-400">{s.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
              {/* Orientation */}
              {pageSize !== "fit" && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Orientation</p>
                  <div className="flex gap-2">
                    {(["portrait", "landscape"] as const).map(o => (
                      <button key={o} onClick={() => setOrient(o)}
                        className={`flex-1 py-2 rounded-xl border text-sm font-semibold transition-all ${
                          orient === o ? "border-indigo-400 bg-indigo-600 text-white" : "border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}>
                        {o === "portrait" ? "↕ Portrait" : "↔ Landscape"}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Image grid with drag-reorder */}
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
                  {entries.length} image{entries.length !== 1 ? "s" : ""} · {formatBytes(totalSize)} · drag to reorder
                </span>
              </div>
              <label className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 cursor-pointer transition-colors">
                + Add more
                <input type="file" accept={ACCEPTED.join(",")} multiple onChange={addFiles} className="sr-only" />
              </label>
            </div>
            <div className="flex flex-wrap gap-3 p-4 bg-white max-h-[340px] overflow-y-auto">
              {entries.map((entry, i) => (
                <div
                  key={entry.id}
                  draggable
                  onDragStart={() => handleDragStart(i)}
                  onDragOver={e => handleDragOver(e, i)}
                  onDragEnd={() => setDragIdx(null)}
                  className={`relative flex-shrink-0 group cursor-grab active:cursor-grabbing
                               transition-opacity ${dragIdx === i ? "opacity-40" : ""}`}
                >
                  {/* Thumbnail */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={entry.previewUrl}
                    alt={entry.file.name}
                    className="w-20 h-24 object-cover rounded-xl border-2 border-slate-200 shadow-sm
                               group-hover:border-indigo-300 transition-colors"
                  />
                  {/* Page order badge */}
                  <span className="absolute bottom-1 left-1 text-[10px] font-bold bg-black/60 text-white
                                   px-1.5 py-0.5 rounded-md">
                    {i + 1}
                  </span>
                  {/* Drag handle */}
                  <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="w-3.5 h-3.5 text-white drop-shadow" />
                  </div>
                  {/* Remove */}
                  <button
                    onClick={() => remove(entry.id)}
                    className="absolute top-1 right-1 w-5 h-5 bg-black/60 hover:bg-red-500 text-white
                               rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100
                               transition-all"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button onClick={handleConvert} disabled={loading}
            className="w-full flex items-center justify-center gap-2.5
                       py-4 rounded-2xl font-semibold text-white text-base
                       bg-gradient-to-r from-slate-900 via-indigo-700 to-indigo-600
                       hover:from-slate-800 hover:via-indigo-600 hover:to-indigo-500
                       disabled:opacity-60 shadow-[0_4px_20px_rgba(79,70,229,0.4)]
                       hover:-translate-y-0.5 transition-all duration-200">
            {loading
              ? <><Loader2 className="w-5 h-5 animate-spin" />Converting…</>
              : <><FileText className="w-5 h-5" />Convert {entries.length} image{entries.length !== 1 ? "s" : ""} to PDF</>
            }
          </button>
        </>
      )}

      {/* Result */}
      {result && (
        <div className="rounded-2xl overflow-hidden border border-emerald-200 shadow-sm animate-slide-up">
          <div className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-900">
            <FileText className="w-4 h-4 text-emerald-400" />
            <p className="text-sm font-semibold text-white">PDF created — {result.pages} page{result.pages !== 1 ? "s" : ""}</p>
            <span className="ml-auto text-xs text-slate-400 font-mono">{formatBytes(result.size)}</span>
          </div>
          <div className="flex gap-3 p-4 bg-emerald-50">
            <button onClick={() => triggerDownload(result.blob, "images.pdf")}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white text-sm
                         bg-gradient-to-r from-slate-900 via-indigo-700 to-indigo-600 hover:-translate-y-0.5 transition-all">
              <Download className="w-4 h-4" />Download PDF
            </button>
            <button onClick={reset}
              className="flex items-center gap-2 py-3 px-5 rounded-xl text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-all">
              <RotateCcw className="w-4 h-4" />New Conversion
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { renderPdfThumbnails, type PdfPageThumb } from "@/lib/converters/pdfConverter";

interface PdfPagePreviewProps {
  file: File;
  /** Selection mode. "none" = display only, "checkbox" = multi-select, "single" = highlight one */
  selectionMode?: "none" | "checkbox" | "single";
  selectedPages?: Set<number>;       // 1-indexed
  onSelectionChange?: (pages: Set<number>) => void;
  /** Drag-to-reorder — only used in Merge / Reorder tools */
  draggable?: boolean;
  order?: number[];                  // 1-indexed page numbers in display order
  onReorder?: (newOrder: number[]) => void;
  /** Show a label above each page thumbnail */
  showLabel?: boolean;
  /** Called once thumbnails are loaded */
  onLoaded?: (thumbs: PdfPageThumb[]) => void;
}

export default function PdfPagePreview({
  file,
  selectionMode = "none",
  selectedPages,
  onSelectionChange,
  draggable = false,
  order,
  onReorder,
  showLabel = true,
  onLoaded,
}: PdfPagePreviewProps) {
  const [thumbs, setThumbs]       = useState<PdfPageThumb[]>([]);
  const [loading, setLoading]     = useState(true);
  const [progress, setProgress]   = useState({ done: 0, total: 0 });
  const [dragIdx, setDragIdx]     = useState<number | null>(null);

  // Render thumbnails when file changes
  useEffect(() => {
    if (!file) return;
    setLoading(true);
    setThumbs([]);
    renderPdfThumbnails(file, 0.22, (done, total) => {
      setProgress({ done, total });
    }).then(t => {
      setThumbs(t);
      setLoading(false);
      onLoaded?.(t);
    }).catch(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  // Determine display order
  const displayOrder = order ?? thumbs.map(t => t.pageNumber);
  const thumbMap = Object.fromEntries(thumbs.map(t => [t.pageNumber, t]));

  // Toggle selection
  const togglePage = (pageNum: number) => {
    if (!onSelectionChange || !selectedPages) return;
    if (selectionMode === "checkbox") {
      const next = new Set(selectedPages);
      if (next.has(pageNum)) next.delete(pageNum); else next.add(pageNum);
      onSelectionChange(next);
    } else if (selectionMode === "single") {
      onSelectionChange(new Set([pageNum]));
    }
  };

  // Drag-to-reorder handlers
  const handleDragStart = (idx: number) => setDragIdx(idx);
  const handleDragOver = useCallback((e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx || !onReorder) return;
    const next = [...displayOrder];
    const [item] = next.splice(dragIdx, 1);
    next.splice(idx, 0, item);
    setDragIdx(idx);
    onReorder(next);
  }, [dragIdx, displayOrder, onReorder]);

  if (loading) {
    return (
      <div className="w-full">
        {/* Dark header */}
        <div className="flex items-center justify-between px-4 py-2.5 rounded-t-2xl bg-slate-900">
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
            <span className="text-xs font-semibold text-slate-300">
              Rendering pages…{progress.total > 0 && ` ${progress.done}/${progress.total}`}
            </span>
          </div>
        </div>
        {/* Progress bar */}
        {progress.total > 0 && (
          <div className="h-1 bg-slate-800 rounded-b-none">
            <div
              className="h-full bg-indigo-500 transition-all duration-200"
              style={{ width: `${(progress.done / progress.total) * 100}%` }}
            />
          </div>
        )}
        {/* Skeleton thumbnails */}
        <div className="flex flex-wrap gap-3 p-4 bg-slate-50 rounded-b-2xl border border-t-0 border-slate-200">
          {Array.from({ length: Math.max(3, progress.total || 3) }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-[90px]">
              <div className="w-[90px] h-[127px] rounded-lg bg-slate-200 shimmer" />
              {showLabel && <div className="h-3 mt-1.5 w-10 mx-auto rounded bg-slate-200 shimmer" />}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!thumbs.length) return null;

  const allSelected = selectedPages && selectedPages.size === thumbs.length;

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
      {/* Dark header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
            {thumbs.length} page{thumbs.length !== 1 ? "s" : ""}
            {draggable && " — drag to reorder"}
            {selectionMode === "checkbox" && selectedPages && ` — ${selectedPages.size} selected`}
          </span>
        </div>

        {/* Select all toggle */}
        {selectionMode === "checkbox" && onSelectionChange && selectedPages && (
          <button
            onClick={() => onSelectionChange(allSelected ? new Set() : new Set(thumbs.map(t => t.pageNumber)))}
            className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            {allSelected ? "Deselect all" : "Select all"}
          </button>
        )}
      </div>

      {/* Thumbnail grid */}
      <div className="flex flex-wrap gap-3 p-4 bg-white max-h-[380px] overflow-y-auto">
        {displayOrder.map((pageNum, displayIdx) => {
          const thumb = thumbMap[pageNum];
          if (!thumb) return null;
          const isSelected = selectedPages?.has(pageNum) ?? false;

          return (
            <div
              key={`${pageNum}-${displayIdx}`}
              draggable={draggable}
              onDragStart={() => handleDragStart(displayIdx)}
              onDragOver={e => handleDragOver(e, displayIdx)}
              onDragEnd={() => setDragIdx(null)}
              onClick={() => selectionMode !== "none" && togglePage(pageNum)}
              className={`flex-shrink-0 flex flex-col items-center gap-1.5 cursor-${
                draggable ? "grab active:cursor-grabbing" : selectionMode !== "none" ? "pointer" : "default"
              }`}
              style={{ opacity: dragIdx === displayIdx ? 0.4 : 1 }}
            >
              {/* Thumbnail */}
              <div className={`relative rounded-lg overflow-hidden border-2 transition-all duration-150
                               shadow-sm hover:shadow-md
                               ${isSelected
                                 ? "border-indigo-500 ring-2 ring-indigo-500/30"
                                 : "border-slate-200 hover:border-slate-300"
                               }`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={thumb.dataUrl}
                  alt={`Page ${pageNum}`}
                  width={90}
                  height={Math.round(90 * (thumb.height / thumb.width))}
                  className="block"
                  style={{ width: 90, height: "auto" }}
                />

                {/* Selection checkmark overlay */}
                {selectionMode === "checkbox" && (
                  <div className={`absolute top-1.5 right-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center
                                   transition-all duration-150
                                   ${isSelected
                                     ? "bg-indigo-600 border-indigo-600"
                                     : "bg-white/80 border-slate-400"
                                   }`}>
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
                      </svg>
                    )}
                  </div>
                )}

                {/* Reorder drag handle indicator */}
                {draggable && (
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5 opacity-40">
                    {[0,1,2].map(i => <span key={i} className="w-1 h-1 bg-slate-600 rounded-full" />)}
                  </div>
                )}
              </div>

              {/* Page label */}
              {showLabel && (
                <span className={`text-[10px] font-semibold tabular-nums
                                  ${isSelected ? "text-indigo-600" : "text-slate-400"}`}>
                  p.{pageNum}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

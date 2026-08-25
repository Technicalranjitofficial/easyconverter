"use client";

import { useState, useCallback, useMemo } from "react";
import { Loader2, Download, RotateCcw, FileText, Save, X } from "lucide-react";
import PdfDropZone from "./PdfDropZone";
import PdfPagePreview, { type PdfPageConfig } from "./PdfPagePreview";
import { reorderPdfPages } from "@/lib/converters/pdfConverter";
import { formatBytes } from "@/lib/utils/fileUtils";
import { triggerDownload } from "@/lib/utils/downloadUtils";
import type { PdfPageThumb } from "@/lib/converters/pdfConverter";

export default function PdfReorder() {
  const [file, setFile]         = useState<File | null>(null);
  const [thumbs, setThumbs]     = useState<PdfPageThumb[]>([]);
  const [order, setOrder]       = useState<number[]>([]);   // 1-indexed, user-controlled order
  const [deleted, setDeleted]   = useState<Set<number>>(new Set()); // 1-indexed deleted pages
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState<{ blob: Blob; size: number; pages: number } | null>(null);

  const handleFile = useCallback((files: File[]) => {
    const f = files[0]; if (!f) return;
    setFile(f); setThumbs([]); setOrder([]); setDeleted(new Set()); setResult(null);
  }, []);

  // When thumbnails load, initialise order to natural page order
  const handleLoaded = (t: PdfPageThumb[]) => {
    setThumbs(t);
    setOrder(t.map(th => th.pageNumber));
  };

  // Build pageConfigs: deleted pages get excluded overlay
  const pageConfigs = useMemo<PdfPageConfig[]>(() => {
    return thumbs.map(t => ({
      pageNumber: t.pageNumber,
      overlay: deleted.has(t.pageNumber)
        ? { type: "excluded" as const }
        : { type: "none" as const },
    }));
  }, [thumbs, deleted]);

  const toggleDelete = (pageNum: number) => {
    setDeleted(prev => {
      const next = new Set(prev);
      if (next.has(pageNum)) next.delete(pageNum); else next.add(pageNum);
      return next;
    });
    // Also remove/restore from order
    setOrder(prev => {
      if (prev.includes(pageNum)) return prev.filter(p => p !== pageNum);
      // Re-insert at natural position
      const all = thumbs.map(t => t.pageNumber);
      const insertAt = all.indexOf(pageNum);
      const next = [...prev];
      next.splice(insertAt, 0, pageNum);
      return next;
    });
  };

  const handleReorder = (newOrder: number[]) => {
    setOrder(newOrder.filter(p => !deleted.has(p)));
  };

  const handleSave = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const finalOrder = order.filter(p => !deleted.has(p));
      const r = await reorderPdfPages(file, finalOrder);
      setResult({ blob: r.blob, size: r.resultSize, pages: r.pageCount });
    } catch { alert("Failed to reorder PDF."); }
    finally { setLoading(false); }
  };

  const reset = () => { setFile(null); setThumbs([]); setOrder([]); setDeleted(new Set()); setResult(null); };

  const activeOrder = order.filter(p => !deleted.has(p));
  const hasChanges = thumbs.length > 0 && (
    deleted.size > 0 ||
    JSON.stringify(activeOrder) !== JSON.stringify(thumbs.map(t => t.pageNumber))
  );

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
              <p className="text-xs text-slate-400">
                {formatBytes(file.size)}
                {thumbs.length > 0 && ` · ${thumbs.length} pages`}
                {deleted.size > 0 && ` · ${deleted.size} deleted`}
              </p>
            </div>
            {hasChanges && (
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg flex-shrink-0">
                {activeOrder.length} pages remaining
              </span>
            )}
          </div>

          {/* Instructions */}
          {thumbs.length > 0 && (
            <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
              <span className="text-slate-400">ⓘ</span>
              <span><strong className="text-slate-600">Drag thumbnails</strong> to reorder pages. Click the <strong className="text-slate-600">✕</strong> on a thumbnail to delete that page.</span>
            </div>
          )}

          {/* Page thumbnail grid with drag-reorder + delete */}
          <PdfPagePreviewWithDelete
            file={file}
            order={activeOrder}
            pageConfigs={pageConfigs}
            onReorder={handleReorder}
            onDelete={toggleDelete}
            deleted={deleted}
            onLoaded={handleLoaded}
          />

          {thumbs.length > 0 && (
            <button onClick={handleSave} disabled={loading || activeOrder.length === 0}
              className="w-full flex items-center justify-center gap-2.5
                         py-4 rounded-2xl font-semibold text-white text-base
                         bg-gradient-to-r from-slate-900 via-indigo-700 to-indigo-600
                         hover:from-slate-800 hover:via-indigo-600 hover:to-indigo-500
                         disabled:opacity-60 shadow-[0_4px_20px_rgba(79,70,229,0.4)]
                         hover:-translate-y-0.5 transition-all duration-200">
              {loading
                ? <><Loader2 className="w-5 h-5 animate-spin" />Saving…</>
                : <><Save className="w-5 h-5" />Save PDF ({activeOrder.length} page{activeOrder.length !== 1 ? "s" : ""})</>
              }
            </button>
          )}
        </>
      )}

      {result && (
        <div className="rounded-2xl overflow-hidden border border-emerald-200 shadow-sm animate-slide-up">
          <div className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-900">
            <Save className="w-4 h-4 text-emerald-400" />
            <p className="text-sm font-semibold text-white">PDF saved — {result.pages} page{result.pages !== 1 ? "s" : ""}</p>
            <span className="ml-auto text-xs text-slate-400">{formatBytes(result.size)}</span>
          </div>
          <div className="flex gap-3 p-4 bg-emerald-50">
            <button onClick={() => triggerDownload(result.blob, file!.name.replace(".pdf", "-reordered.pdf"))}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white text-sm
                         bg-gradient-to-r from-slate-900 via-indigo-700 to-indigo-600 hover:-translate-y-0.5 transition-all">
              <Download className="w-4 h-4" />Download Reordered PDF
            </button>
            <button onClick={reset}
              className="flex items-center gap-2 py-3 px-5 rounded-xl text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-all">
              <RotateCcw className="w-4 h-4" />Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Extended preview grid with per-thumbnail delete button ───────────────────

import { useEffect, useRef } from "react";
import { renderPdfThumbnails } from "@/lib/converters/pdfConverter";
import { Loader2 as L2 } from "lucide-react";

function PdfPagePreviewWithDelete({
  file, order, pageConfigs, onReorder, onDelete, deleted, onLoaded,
}: {
  file: File;
  order: number[];
  pageConfigs: PdfPageConfig[];
  onReorder: (o: number[]) => void;
  onDelete: (pageNum: number) => void;
  deleted: Set<number>;
  onLoaded: (t: PdfPageThumb[]) => void;
}) {
  const [thumbs, setThumbs]     = useState<PdfPageThumb[]>([]);
  const [loading, setLoading]   = useState(true);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [dragIdx, setDragIdx]   = useState<number | null>(null);
  const thumbMap = Object.fromEntries(thumbs.map(t => [t.pageNumber, t]));
  const configMap = Object.fromEntries(pageConfigs.map(c => [c.pageNumber, c.overlay]));

  useEffect(() => {
    setLoading(true);
    renderPdfThumbnails(file, 0.22, (done, total) => setProgress({ done, total }))
      .then(t => { setThumbs(t); setLoading(false); onLoaded(t); })
      .catch(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    const next = [...order];
    const [item] = next.splice(dragIdx, 1);
    next.splice(idx, 0, item);
    setDragIdx(idx);
    onReorder(next);
  };

  // All pages for display (including deleted, shown dimmed)
  const allPages = thumbs.map(t => t.pageNumber);
  const displayOrder = [
    ...order,
    ...allPages.filter(p => deleted.has(p)),
  ];

  if (loading) return (
    <div className="rounded-2xl overflow-hidden border border-slate-200">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-900">
        <L2 className="w-4 h-4 text-indigo-400 animate-spin" />
        <span className="text-xs font-semibold text-slate-300">
          Rendering pages{progress.total > 0 ? ` ${progress.done}/${progress.total}` : "…"}
        </span>
      </div>
      <div className="flex flex-wrap gap-3 p-4 bg-slate-50">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="w-[90px] h-[127px] rounded-lg bg-slate-200 shimmer flex-shrink-0" />
        ))}
      </div>
    </div>
  );

  if (!thumbs.length) return null;

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
            {order.length} active · {deleted.size} deleted — drag to reorder
          </span>
        </div>
        {deleted.size > 0 && (
          <button onClick={() => { /* restore all deleted */
            const restored = thumbs.map(t => t.pageNumber);
            onReorder(restored);
            // caller handles deleted state via onDelete toggle
          }}
            className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 transition-colors">
            Restore all
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-3 p-4 bg-white max-h-[360px] overflow-y-auto">
        {displayOrder.map((pageNum, displayIdx) => {
          const thumb = thumbMap[pageNum];
          if (!thumb) return null;
          const isDeleted = deleted.has(pageNum);
          const overlay = configMap[pageNum];
          const activeIdx = order.indexOf(pageNum);

          return (
            <div
              key={pageNum}
              draggable={!isDeleted}
              onDragStart={() => !isDeleted && setDragIdx(activeIdx)}
              onDragOver={e => !isDeleted && handleDragOver(e, activeIdx)}
              onDragEnd={() => setDragIdx(null)}
              className={`relative flex-shrink-0 group flex flex-col items-center gap-1.5
                          ${isDeleted ? "cursor-default opacity-35" : "cursor-grab active:cursor-grabbing"}`}
              style={{ opacity: dragIdx === activeIdx ? 0.4 : isDeleted ? 0.35 : 1 }}
            >
              <div className={`relative rounded-lg overflow-hidden border-2 shadow-sm transition-all
                               ${isDeleted ? "border-red-200" : "border-slate-200 hover:border-slate-300"}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={thumb.dataUrl}
                  alt={`Page ${pageNum}`}
                  style={{ width: 90, height: "auto", display: "block" }}
                />
                {isDeleted && (
                  <div className="absolute inset-0 bg-red-500/15 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-red-700 bg-white/90 px-1.5 py-0.5 rounded">Deleted</span>
                  </div>
                )}
                {/* Delete/restore button */}
                <button
                  onClick={() => onDelete(pageNum)}
                  className={`absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center
                               text-white text-xs font-bold transition-all
                               ${isDeleted
                                 ? "bg-emerald-500 hover:bg-emerald-400 opacity-100"
                                 : "bg-black/60 hover:bg-red-500 opacity-0 group-hover:opacity-100"
                               }`}
                  title={isDeleted ? "Restore page" : "Delete page"}
                >
                  {isDeleted ? "↩" : <X className="w-3 h-3" />}
                </button>
              </div>
              <span className={`text-[10px] font-semibold tabular-nums ${isDeleted ? "text-red-300" : "text-slate-400"}`}>
                {isDeleted ? "✕" : `${activeIdx + 1}. p${pageNum}`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Loader2 } from "lucide-react";
import { renderPdfThumbnails, type PdfPageThumb } from "@/lib/converters/pdfConverter";

// ── Visual overlay types ─────────────────────────────────────────────────────

export type PageOverlay =
  | { type: "none" }
  | { type: "selected" }          // green highlight — will be processed
  | { type: "excluded" }          // dimmed — will NOT be processed
  | { type: "rotate"; angle: 0 | 90 | 180 | 270 }   // rotate the thumbnail image
  | { type: "watermark"; text: string; opacity: number; angle: number; color: string; tile: boolean; fontSize: number }
  | { type: "pageNumber"; label: string; position: string }
  | { type: "compressed"; savingPct: number }         // size saving badge
  | { type: "mergeOrder"; fileLabel: string; fileColor: string; order: number }; // merge group

export interface PdfPageConfig {
  pageNumber: number;
  overlay: PageOverlay;
}

interface PdfPagePreviewProps {
  file: File;
  pageConfigs?: PdfPageConfig[];      // per-page overlay instructions
  selectionMode?: "none" | "checkbox" | "single";
  selectedPages?: Set<number>;
  onSelectionChange?: (pages: Set<number>) => void;
  draggable?: boolean;
  order?: number[];
  onReorder?: (newOrder: number[]) => void;
  showLabel?: boolean;
  onLoaded?: (thumbs: PdfPageThumb[]) => void;
}

// ── Canvas overlay renderer ──────────────────────────────────────────────────

function OverlayCanvas({
  thumb,
  overlay,
}: {
  thumb: PdfPageThumb;
  overlay: PageOverlay;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !thumb) return;
    const W = thumb.width, H = thumb.height;
    const isRotate = overlay.type === "rotate" && overlay.angle !== 0;
    // For rotation, swap dimensions
    const cW = (overlay.type === "rotate" && (overlay.angle === 90 || overlay.angle === 270)) ? H : W;
    const cH = (overlay.type === "rotate" && (overlay.angle === 90 || overlay.angle === 270)) ? W : H;
    canvas.width  = cW;
    canvas.height = cH;

    const ctx = canvas.getContext("2d")!;
    const img = new Image();

    img.onload = () => {
      ctx.clearRect(0, 0, cW, cH);

      // ── Draw base image (possibly rotated) ──────────────────────────
      if (overlay.type === "rotate" && overlay.angle !== 0) {
        ctx.save();
        ctx.translate(cW / 2, cH / 2);
        ctx.rotate((overlay.angle * Math.PI) / 180);
        ctx.drawImage(img, -W / 2, -H / 2, W, H);
        ctx.restore();
      } else {
        ctx.drawImage(img, 0, 0, cW, cH);
      }

      // ── Overlay effects ──────────────────────────────────────────────
      switch (overlay.type) {
        case "excluded": {
          ctx.fillStyle = "rgba(0,0,0,0.45)";
          ctx.fillRect(0, 0, cW, cH);
          break;
        }

        case "selected": {
          // Subtle green tint
          ctx.fillStyle = "rgba(16,185,129,0.12)";
          ctx.fillRect(0, 0, cW, cH);
          // Green checkmark badge top-right
          const r = Math.round(cW * 0.13);
          const cx2 = cW - r - 4, cy2 = r + 4;
          ctx.fillStyle = "#10b981";
          ctx.beginPath(); ctx.arc(cx2, cy2, r, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = "white"; ctx.lineWidth = r * 0.3; ctx.lineCap = "round"; ctx.lineJoin = "round";
          ctx.beginPath();
          ctx.moveTo(cx2 - r * 0.45, cy2);
          ctx.lineTo(cx2 - r * 0.1, cy2 + r * 0.4);
          ctx.lineTo(cx2 + r * 0.5, cy2 - r * 0.4);
          ctx.stroke();
          // "Will extract" label at bottom
          const fsPx = Math.round(cW * 0.1);
          ctx.font = `bold ${fsPx}px Arial`;
          const lbl = "Will extract";
          const tw = ctx.measureText(lbl).width;
          const pad = fsPx * 0.4;
          ctx.fillStyle = "#10b981";
          ctx.beginPath(); ctx.roundRect(cW / 2 - tw / 2 - pad, cH - fsPx * 1.8, tw + pad * 2, fsPx * 1.4, 3); ctx.fill();
          ctx.fillStyle = "white"; ctx.textBaseline = "middle";
          ctx.fillText(lbl, cW / 2 - tw / 2, cH - fsPx * 1.1);
          break;
        }

        case "rotate": {
          // Draw a subtle arrow badge showing the rotation direction
          if (overlay.angle !== 0) {
            const badge = Math.round(cW * 0.18);
            const bx = cW - badge - 4, by = cH - badge - 4;
            ctx.fillStyle = "rgba(79,70,229,0.9)";
            ctx.beginPath(); ctx.roundRect(bx, by, badge, badge, 4); ctx.fill();
            ctx.strokeStyle = "white"; ctx.lineWidth = badge * 0.15; ctx.lineCap = "round";
            // Simple curved arrow
            const cx2 = bx + badge / 2, cy2 = by + badge / 2, arR = badge * 0.3;
            ctx.beginPath();
            ctx.arc(cx2, cy2, arR, -Math.PI * 0.2, Math.PI * 0.8);
            ctx.stroke();
            // Arrowhead
            const endAngle = Math.PI * 0.8;
            const ex = cx2 + arR * Math.cos(endAngle);
            const ey = cy2 + arR * Math.sin(endAngle);
            ctx.beginPath();
            ctx.moveTo(ex, ey);
            ctx.lineTo(ex - badge * 0.12, ey - badge * 0.04);
            ctx.lineTo(ex + badge * 0.04, ey - badge * 0.12);
            ctx.closePath();
            ctx.fillStyle = "white"; ctx.fill();
            // Degree label
            const lbl2 = `${overlay.angle}°`;
            ctx.font = `bold ${Math.round(badge * 0.3)}px Arial`;
            ctx.fillStyle = "white"; ctx.textBaseline = "middle"; ctx.textAlign = "center";
            ctx.fillText(lbl2, cx2, cy2);
            ctx.textAlign = "left";
          }
          break;
        }

        case "watermark": {
          const fsPx = Math.max(6, Math.round((overlay.fontSize / 100) * cW * 2.5));
          ctx.globalAlpha = overlay.opacity;
          ctx.fillStyle = overlay.color;
          ctx.font = `bold ${fsPx}px Arial, sans-serif`;
          ctx.textBaseline = "middle";
          const tw = ctx.measureText(overlay.text).width;
          if (overlay.tile) {
            const stepX = tw + fsPx * 3;
            const stepY = fsPx * 4;
            for (let y = 0; y < cH + stepY; y += stepY) {
              for (let x = -tw; x < cW + tw; x += stepX) {
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate((overlay.angle * Math.PI) / 180);
                ctx.fillText(overlay.text, 0, 0);
                ctx.restore();
              }
            }
          } else {
            ctx.save();
            ctx.translate(cW / 2, cH / 2);
            ctx.rotate((overlay.angle * Math.PI) / 180);
            ctx.fillText(overlay.text, -tw / 2, 0);
            ctx.restore();
          }
          ctx.globalAlpha = 1;
          break;
        }

        case "pageNumber": {
          const fsPx = Math.max(6, Math.round(cW * 0.09));
          const margin = Math.round(cW * 0.05);
          ctx.font = `${fsPx}px Arial, sans-serif`;
          ctx.textBaseline = "middle";
          const tw = ctx.measureText(overlay.label).width;
          const pad = fsPx * 0.35;
          let x = 0, y = 0;
          const pos = overlay.position;
          if (pos.includes("left"))        x = margin;
          else if (pos.includes("right"))  x = cW - tw - margin;
          else                             x = (cW - tw) / 2;
          if (pos.includes("top"))         y = margin + fsPx * 0.6;
          else                             y = cH - margin - fsPx * 0.6;
          // White pill
          ctx.fillStyle = "rgba(255,255,255,0.92)";
          ctx.beginPath();
          ctx.roundRect(x - pad, y - fsPx * 0.65, tw + pad * 2, fsPx * 1.3, 3);
          ctx.fill();
          ctx.fillStyle = "rgba(30,30,30,0.9)";
          ctx.fillText(overlay.label, x, y);
          break;
        }

        case "compressed": {
          if (overlay.savingPct > 0) {
            const badge = Math.round(cW * 0.38);
            const bx = (cW - badge) / 2, by = (cH - badge * 0.5) / 2;
            ctx.fillStyle = "rgba(0,0,0,0.15)";
            ctx.fillRect(0, 0, cW, cH);
            ctx.fillStyle = "rgba(16,185,129,0.92)";
            ctx.beginPath(); ctx.roundRect(bx, by, badge, badge * 0.5, 5); ctx.fill();
            const fs2 = Math.round(badge * 0.28);
            ctx.font = `bold ${fs2}px Arial`;
            ctx.fillStyle = "white"; ctx.textBaseline = "middle"; ctx.textAlign = "center";
            ctx.fillText(`-${overlay.savingPct}%`, cW / 2, cH / 2);
            ctx.textAlign = "left";
          }
          break;
        }

        case "mergeOrder": {
          // Color strip at top + file label + order number
          const stripH = Math.round(cH * 0.09);
          ctx.fillStyle = overlay.fileColor;
          ctx.fillRect(0, 0, cW, stripH);
          const fs3 = Math.round(stripH * 0.6);
          ctx.font = `bold ${fs3}px Arial`;
          ctx.fillStyle = "white"; ctx.textBaseline = "middle";
          ctx.fillText(overlay.fileLabel, 4, stripH / 2);

          // Order badge bottom-right
          const badge2 = Math.round(cW * 0.18);
          ctx.fillStyle = overlay.fileColor;
          ctx.beginPath(); ctx.arc(cW - badge2 / 2 - 3, cH - badge2 / 2 - 3, badge2 / 2, 0, Math.PI * 2); ctx.fill();
          ctx.font = `bold ${Math.round(badge2 * 0.5)}px Arial`;
          ctx.fillStyle = "white"; ctx.textAlign = "center";
          ctx.fillText(String(overlay.order), cW - badge2 / 2 - 3, cH - badge2 / 2 - 3);
          ctx.textAlign = "left";
          break;
        }
      }
    };

    img.src = thumb.dataUrl;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thumb, JSON.stringify(overlay)]);

  const aspectRatio = (overlay.type === "rotate" && (overlay.angle === 90 || overlay.angle === 270))
    ? thumb.width / thumb.height
    : thumb.height / thumb.width;

  return (
    <canvas
      ref={canvasRef}
      style={{ width: 90, height: Math.round(90 * aspectRatio), display: "block" }}
    />
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function PdfPagePreview({
  file,
  pageConfigs,
  selectionMode = "none",
  selectedPages,
  onSelectionChange,
  draggable = false,
  order,
  onReorder,
  showLabel = true,
  onLoaded,
}: PdfPagePreviewProps) {
  const [thumbs, setThumbs]     = useState<PdfPageThumb[]>([]);
  const [loading, setLoading]   = useState(true);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [dragIdx, setDragIdx]   = useState<number | null>(null);

  useEffect(() => {
    if (!file) return;
    setLoading(true);
    setThumbs([]);
    renderPdfThumbnails(file, 0.22, (done, total) => setProgress({ done, total }))
      .then(t => { setThumbs(t); setLoading(false); onLoaded?.(t); })
      .catch(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  const displayOrder = order ?? thumbs.map(t => t.pageNumber);
  const thumbMap = Object.fromEntries(thumbs.map(t => [t.pageNumber, t]));
  const configMap = Object.fromEntries((pageConfigs ?? []).map(c => [c.pageNumber, c.overlay]));

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
      <div className="w-full rounded-2xl overflow-hidden border border-slate-200">
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900">
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
            <span className="text-xs font-semibold text-slate-300">
              Rendering pages{progress.total > 0 ? ` ${progress.done}/${progress.total}` : "…"}
            </span>
          </div>
          {progress.total > 0 && (
            <span className="text-xs text-slate-500">{Math.round((progress.done / progress.total) * 100)}%</span>
          )}
        </div>
        {progress.total > 0 && (
          <div className="h-1 bg-slate-800">
            <div className="h-full bg-indigo-500 transition-all" style={{ width: `${(progress.done / progress.total) * 100}%` }} />
          </div>
        )}
        <div className="flex flex-wrap gap-3 p-4 bg-slate-50">
          {Array.from({ length: Math.max(3, progress.total || 3) }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-[90px]">
              <div className="w-[90px] h-[127px] rounded-lg bg-slate-200 shimmer" />
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
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
            {thumbs.length} page{thumbs.length !== 1 ? "s" : ""}
            {draggable && " — drag to reorder"}
            {selectionMode === "checkbox" && selectedPages && ` — ${selectedPages.size} selected`}
          </span>
        </div>
        {selectionMode === "checkbox" && onSelectionChange && selectedPages && (
          <button
            onClick={() => onSelectionChange(allSelected ? new Set() : new Set(thumbs.map(t => t.pageNumber)))}
            className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            {allSelected ? "Deselect all" : "Select all"}
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-3 p-4 bg-white max-h-[360px] overflow-y-auto">
        {displayOrder.map((pageNum, displayIdx) => {
          const thumb = thumbMap[pageNum];
          if (!thumb) return null;
          const overlay: PageOverlay = configMap[pageNum] ?? { type: "none" };
          const isSelected = selectedPages?.has(pageNum) ?? false;
          const isExcluded = overlay.type === "excluded";

          return (
            <div
              key={`${pageNum}-${displayIdx}`}
              draggable={draggable}
              onDragStart={() => setDragIdx(displayIdx)}
              onDragOver={e => handleDragOver(e, displayIdx)}
              onDragEnd={() => setDragIdx(null)}
              onClick={() => selectionMode !== "none" && togglePage(pageNum)}
              className={`flex-shrink-0 flex flex-col items-center gap-1.5
                          ${draggable ? "cursor-grab active:cursor-grabbing" : selectionMode !== "none" ? "cursor-pointer" : "cursor-default"}`}
              style={{ opacity: dragIdx === displayIdx ? 0.4 : isExcluded ? 0.45 : 1 }}
            >
              <div className={`relative rounded-lg overflow-hidden border-2 shadow-sm transition-all duration-150
                               hover:shadow-md
                               ${isSelected && selectionMode === "checkbox"
                                 ? "border-indigo-500 ring-2 ring-indigo-500/30"
                                 : overlay.type === "selected"
                                 ? "border-emerald-500 ring-2 ring-emerald-500/20"
                                 : overlay.type === "excluded"
                                 ? "border-slate-200"
                                 : overlay.type === "mergeOrder"
                                 ? `border-slate-300`
                                 : "border-slate-200 hover:border-slate-300"
                               }`}>
                {/* Rendered overlay canvas */}
                <OverlayCanvas thumb={thumb} overlay={overlay} />

                {/* Checkbox overlay (for selectionMode=checkbox) */}
                {selectionMode === "checkbox" && (
                  <div className={`absolute top-1.5 right-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center
                                   transition-all ${isSelected ? "bg-indigo-600 border-indigo-600" : "bg-white/80 border-slate-400"}`}>
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
                      </svg>
                    )}
                  </div>
                )}
              </div>

              {showLabel && (
                <span className={`text-[10px] font-semibold tabular-nums
                                  ${overlay.type === "selected" ? "text-emerald-600"
                                    : overlay.type === "excluded" ? "text-slate-300"
                                    : isSelected ? "text-indigo-600" : "text-slate-400"}`}>
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

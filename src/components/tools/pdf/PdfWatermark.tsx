"use client";

import { useState, useCallback, useId, useEffect, useRef } from "react";
import { Loader2, Stamp, Download, RotateCcw, FileText } from "lucide-react";
import PdfDropZone from "./PdfDropZone";
import PdfPagePreview from "./PdfPagePreview";
import { watermarkPdf, type PdfPageThumb } from "@/lib/converters/pdfConverter";
import { formatBytes } from "@/lib/utils/fileUtils";
import { triggerDownload } from "@/lib/utils/downloadUtils";

interface PdfItem { id: string; file: File; status: string; blob?: Blob; size?: number; }

function hexToRgb01(hex: string): { r: number; g: number; b: number } {
  return {
    r: parseInt(hex.slice(1,3),16)/255,
    g: parseInt(hex.slice(3,5),16)/255,
    b: parseInt(hex.slice(5,7),16)/255,
  };
}

// ─── Live watermark preview on canvas thumbnail ────────────────────────────
function WatermarkPreviewCanvas({
  thumb, text, fontSize, opacity, angle, color, tile,
}: {
  thumb: PdfPageThumb; text: string; fontSize: number; opacity: number;
  angle: number; color: string; tile: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !thumb) return;
    const img = new Image();
    img.onload = () => {
      canvas.width  = thumb.width;
      canvas.height = thumb.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);

      // Watermark
      const fsPx = Math.max(6, Math.round((fontSize / 100) * canvas.width * 2.5));
      ctx.globalAlpha = opacity;
      ctx.fillStyle = color;
      ctx.font = `bold ${fsPx}px Arial, sans-serif`;
      ctx.textBaseline = "middle";

      const tw = ctx.measureText(text).width;

      if (tile) {
        const stepX = tw + fsPx * 3;
        const stepY = fsPx * 4;
        for (let y = 0; y < canvas.height + stepY; y += stepY) {
          for (let x = -tw; x < canvas.width + tw; x += stepX) {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate((angle * Math.PI) / 180);
            ctx.fillText(text, 0, 0);
            ctx.restore();
          }
        }
      } else {
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((angle * Math.PI) / 180);
        ctx.fillText(text, -tw / 2, 0);
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    };
    img.src = thumb.dataUrl;
  }, [thumb, text, fontSize, opacity, angle, color, tile]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "auto", borderRadius: 8, display: "block" }}
    />
  );
}

export default function PdfWatermark() {
  const uid = useId();
  const [items, setItems]       = useState<PdfItem[]>([]);
  const [firstThumbs, setFirstThumbs] = useState<{ [id: string]: PdfPageThumb }>({});
  const [text, setText]         = useState("CONFIDENTIAL");
  const [fontSize, setFontSize] = useState(48);
  const [opacity, setOpacity]   = useState(0.15);
  const [angle, setAngle]       = useState(45);
  const [color, setColor]       = useState("#888888");
  const [tile, setTile]         = useState(true);
  const [loading, setLoading]   = useState(false);
  const [allDone, setAllDone]   = useState(false);

  const addFiles = useCallback((files: File[]) => {
    setItems(prev => [...prev, ...files.map(f => ({ id: `${uid}-${f.name}-${Date.now()}`, file: f, status: "ready" }))]);
    setAllDone(false);
  }, [uid]);

  const remove = (id: string) => setItems(prev => prev.filter(i => i.id !== id));

  const handleApply = async () => {
    const ready = items.filter(i => i.status === "ready");
    if (!ready.length || !text.trim()) return;
    setLoading(true);
    setItems(prev => prev.map(i => i.status === "ready" ? { ...i, status: "processing" } : i));

    await Promise.allSettled(ready.map(async item => {
      try {
        const r = await watermarkPdf(item.file, {
          text: text.trim(), fontSize, opacity, angle,
          color: hexToRgb01(color), tile,
        });
        setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: "done", blob: r.blob, size: r.resultSize } : i));
      } catch {
        setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: "error" } : i));
      }
    }));
    setLoading(false);
    setAllDone(true);
  };

  const doneItems  = items.filter(i => i.status === "done");
  const readyCount = items.filter(i => i.status === "ready").length;

  // First uploaded file for preview
  const previewFile = items.find(i => i.status === "ready")?.file;
  const previewId   = items.find(i => i.status === "ready")?.id ?? "";
  const previewThumb = firstThumbs[previewId];

  return (
    <div className="w-full space-y-5">
      {!allDone && <PdfDropZone onFilesAdded={addFiles} disabled={loading} />}

      {!allDone && items.length > 0 && (
        <div className="space-y-4">
          {/* Settings panel */}
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
            <div className="px-4 py-2.5 bg-slate-900 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">Watermark Settings</span>
            </div>

            <div className={`${previewThumb ? "grid grid-cols-1 lg:grid-cols-[1fr_180px]" : ""} bg-white`}>
              {/* Controls */}
              <div className="p-4 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Watermark Text</label>
                  <input type="text" value={text} onChange={e => setText(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Size</label>
                      <span className="text-xs font-mono font-semibold text-indigo-600">{fontSize}pt</span>
                    </div>
                    <input type="range" min={12} max={120} step={4} value={fontSize} onChange={e => setFontSize(Number(e.target.value))}
                      className="w-full accent-indigo-500 h-2 rounded-full cursor-pointer" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Opacity</label>
                      <span className="text-xs font-mono font-semibold text-indigo-600">{Math.round(opacity * 100)}%</span>
                    </div>
                    <input type="range" min={0.05} max={1} step={0.05} value={opacity} onChange={e => setOpacity(Number(e.target.value))}
                      className="w-full accent-indigo-500 h-2 rounded-full cursor-pointer" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 items-end">
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Angle</label>
                      <span className="text-xs font-mono font-semibold text-indigo-600">{angle}°</span>
                    </div>
                    <input type="range" min={0} max={90} step={5} value={angle} onChange={e => setAngle(Number(e.target.value))}
                      className="w-full accent-indigo-500 h-2 rounded-full cursor-pointer" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Color</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={color} onChange={e => setColor(e.target.value)}
                        className="w-10 h-10 rounded-xl border-2 border-slate-200 cursor-pointer p-0.5 bg-white" />
                      <span className="text-xs font-mono text-slate-600">{color.toUpperCase()}</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Mode</label>
                    <div className="flex rounded-xl overflow-hidden border border-slate-200 divide-x divide-slate-200">
                      {[{ v: true, l: "Tile" }, { v: false, l: "Center" }].map(m => (
                        <button key={String(m.v)} onClick={() => setTile(m.v)}
                          className={`flex-1 py-2 text-xs font-semibold transition-all ${
                            tile === m.v ? "bg-slate-900 text-white" : "bg-white text-slate-500 hover:bg-slate-50"
                          }`}>{m.l}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Live preview panel */}
              {previewThumb && (
                <div className="p-4 border-t lg:border-t-0 lg:border-l border-slate-100 bg-slate-50 flex flex-col items-center gap-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Live Preview</p>
                  <div className="rounded-lg overflow-hidden border border-slate-200 shadow-sm w-full max-w-[160px]">
                    <WatermarkPreviewCanvas
                      thumb={previewThumb}
                      text={text} fontSize={fontSize} opacity={opacity}
                      angle={angle} color={color} tile={tile}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">Page 1 preview</p>
                </div>
              )}
            </div>

            {/* File list */}
            <div className="divide-y divide-slate-100 border-t border-slate-100">
              {items.filter(i => i.status !== "done").map(item => (
                <div key={item.id} className="flex items-center gap-3 px-4 py-3 bg-white">
                  <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                    {item.status === "processing"
                      ? <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
                      : <FileText className="w-4 h-4 text-red-500" />}
                  </div>
                  <p className="text-sm text-slate-700 flex-1 truncate">{item.file.name}</p>
                  <p className="text-xs text-slate-400 flex-shrink-0">{formatBytes(item.file.size)}</p>
                  {item.status === "ready" && (
                    <button onClick={() => remove(item.id)} className="text-slate-300 hover:text-red-400 p-1 transition-colors">✕</button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Hidden PdfPagePreview just to get first thumb for live preview */}
          {previewFile && (
            <div className="hidden">
              <PdfPagePreview
                file={previewFile}
                selectionMode="none"
                showLabel={false}
                onLoaded={t => {
                  if (t[0]) setFirstThumbs(prev => ({ ...prev, [previewId]: t[0] }));
                }}
              />
            </div>
          )}

          {readyCount > 0 && (
            <button onClick={handleApply} disabled={loading || !text.trim()}
              className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-semibold text-white
                         bg-gradient-to-r from-slate-900 via-indigo-700 to-indigo-600
                         hover:from-slate-800 hover:via-indigo-600 hover:to-indigo-500
                         disabled:opacity-60 shadow-[0_4px_20px_rgba(79,70,229,0.4)]
                         hover:-translate-y-0.5 transition-all duration-200">
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" />Adding Watermark…</> : <><Stamp className="w-5 h-5" />Watermark {readyCount} PDF{readyCount !== 1 ? "s" : ""}</>}
            </button>
          )}
        </div>
      )}

      {doneItems.length > 0 && (
        <div className="space-y-2 animate-slide-up">
          {doneItems.map(item => (
            <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl border-l-[3px] border-l-emerald-500 border border-slate-100 bg-white shadow-sm">
              <FileText className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 truncate">{item.file.name}</p>
                <p className="text-xs text-slate-400">{formatBytes(item.size ?? 0)}</p>
              </div>
              <button onClick={() => triggerDownload(item.blob!, item.file.name.replace(".pdf", "-watermarked.pdf"))}
                className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-700 transition-colors flex-shrink-0">
                <Download className="w-3.5 h-3.5 inline mr-1" />DL
              </button>
            </div>
          ))}
          <button onClick={() => { setItems([]); setAllDone(false); setFirstThumbs({}); }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors mt-2">
            <RotateCcw className="w-4 h-4" />Watermark More PDFs
          </button>
        </div>
      )}
    </div>
  );
}

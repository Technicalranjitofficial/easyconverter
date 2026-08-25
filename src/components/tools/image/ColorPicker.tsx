"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Copy, Check, Pipette } from "lucide-react";
import DropZone from "@/components/tools/shared/DropZone";
import { pickColorFromCanvas, type PickedColor } from "@/lib/converters/imageConverter";

const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_HISTORY = 12;

export default function ColorPicker() {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef       = useRef<HTMLImageElement | null>(null);

  const [loaded, setLoaded]     = useState(false);
  const [hover, setHover]       = useState<PickedColor | null>(null);
  const [locked, setLocked]     = useState<PickedColor | null>(null);
  const [history, setHistory]   = useState<PickedColor[]>([]);
  const [copied, setCopied]     = useState<string | null>(null);
  const [displayW, setDisplayW] = useState(0);
  const [displayH, setDisplayH] = useState(0);
  const [naturalW, setNaturalW] = useState(0);
  const [naturalH, setNaturalH] = useState(0);

  const loadFile = useCallback((files: File[]) => {
    const file = files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      setNaturalW(img.naturalWidth);
      setNaturalH(img.naturalHeight);
      setLoaded(true);
    };
    img.src = url;
  }, []);

  // Size canvas to container
  useEffect(() => {
    if (!naturalW || !naturalH || !containerRef.current) return;
    const maxW = containerRef.current.clientWidth || 700;
    const scale = Math.min(1, maxW / naturalW);
    setDisplayW(Math.round(naturalW * scale));
    setDisplayH(Math.round(naturalH * scale));
  }, [naturalW, naturalH]);

  // Draw image
  useEffect(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || !displayW || !displayH) return;
    canvas.width  = displayW;
    canvas.height = displayH;
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(img, 0, 0, displayW, displayH);
  }, [displayW, displayH, loaded]);

  const getCanvasPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const { x, y } = getCanvasPos(e);
    try { setHover(pickColorFromCanvas(canvasRef.current, x, y)); } catch { /* ignore */ }
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const { x, y } = getCanvasPos(e);
    try {
      const color = pickColorFromCanvas(canvasRef.current, x, y);
      setLocked(color);
      setHistory(prev => [color, ...prev.filter(c => c.hex !== color.hex)].slice(0, MAX_HISTORY));
    } catch { /* ignore */ }
  };

  const copyColor = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 1500);
  };

  const active = locked ?? hover;

  const ColorRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-center justify-between gap-3 py-2 border-b border-slate-100 last:border-0">
      <span className="text-xs font-bold uppercase tracking-widest text-slate-400 w-10">{label}</span>
      <span className="text-sm font-mono text-slate-700 flex-1 truncate">{value}</span>
      <button
        onClick={() => copyColor(value)}
        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors flex-shrink-0"
      >
        {copied === value ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
    </div>
  );

  return (
    <div className="w-full space-y-5">
      {!loaded && (
        <DropZone onFilesAdded={loadFile} acceptedTypes={ACCEPTED} maxSizeMB={20} maxFiles={1} currentCount={0} />
      )}

      {loaded && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-5">
          {/* Canvas */}
          <div ref={containerRef} className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-900">
              <Pipette className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-semibold text-slate-300">Click to pick a color · Move to preview</span>
            </div>
            <div className="relative bg-[repeating-conic-gradient(#eee_0%_25%,#fff_0%_50%)] bg-[length:16px_16px]">
              <canvas
                ref={canvasRef}
                style={{ maxWidth: "100%", display: "block", cursor: "crosshair" }}
                onMouseMove={handleMouseMove}
                onClick={handleClick}
                onMouseLeave={() => setHover(null)}
              />
              {/* Live preview magnifier dot */}
              {hover && !locked && (
                <div
                  className="pointer-events-none absolute w-5 h-5 rounded-full border-2 border-white shadow-lg -translate-x-1/2 -translate-y-1/2"
                  style={{ background: hover.hex }}
                />
              )}
            </div>
          </div>

          {/* Color panel */}
          <div className="space-y-4">
            {/* Active color swatch */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
              <div
                className="w-full h-24 transition-colors duration-100"
                style={{ background: active?.hex ?? "#f1f5f9" }}
              />
              {active ? (
                <div className="p-4 bg-white">
                  <ColorRow label="HEX"  value={active.hex} />
                  <ColorRow label="RGB"  value={`rgb(${active.rgb.r}, ${active.rgb.g}, ${active.rgb.b})`} />
                  <ColorRow label="HSL"  value={`hsl(${active.hsl.h}, ${active.hsl.s}%, ${active.hsl.l}%)`} />
                </div>
              ) : (
                <p className="p-4 text-xs text-slate-400 text-center">Move cursor over the image</p>
              )}
            </div>

            {/* History */}
            {history.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Picked Colors</p>
                <div className="flex flex-wrap gap-2">
                  {history.map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => copyColor(c.hex)}
                      title={`${c.hex} — click to copy`}
                      className="group relative w-8 h-8 rounded-lg border-2 border-white shadow-sm
                                 hover:scale-110 transition-transform"
                      style={{ background: c.hex }}
                    >
                      {copied === c.hex && (
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px]
                                         bg-slate-900 text-white px-1.5 py-0.5 rounded whitespace-nowrap">
                          Copied!
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => { setLoaded(false); setLocked(null); setHover(null); setHistory([]); imgRef.current = null; }}
              className="w-full py-2.5 rounded-xl text-sm font-semibold
                         text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Load New Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useCallback, useRef, useEffect, useId } from "react";
import { Loader2, Crop, RotateCcw, Download } from "lucide-react";
import DropZone from "@/components/tools/shared/DropZone";
import { cropImage, type ImageOutputFormat, type CropArea } from "@/lib/converters/imageConverter";
import { triggerDownload } from "@/lib/utils/downloadUtils";
import { formatBytes } from "@/lib/utils/fileUtils";

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

type AspectRatio = "free" | "1:1" | "16:9" | "4:3" | "3:2" | "9:16";

const RATIOS: { label: string; value: AspectRatio; ratio: number | null }[] = [
  { label: "Free",  value: "free", ratio: null },
  { label: "1 : 1", value: "1:1",  ratio: 1 },
  { label: "16 : 9", value: "16:9", ratio: 16 / 9 },
  { label: "4 : 3",  value: "4:3",  ratio: 4 / 3 },
  { label: "3 : 2",  value: "3:2",  ratio: 3 / 2 },
  { label: "9 : 16", value: "9:16", ratio: 9 / 16 },
];

const OUTPUT_FORMATS: { label: string; value: ImageOutputFormat }[] = [
  { label: "JPG",  value: "image/jpeg" },
  { label: "PNG",  value: "image/png"  },
  { label: "WebP", value: "image/webp" },
];

// ─── Drag state ──────────────────────────────────────────────────────────────

type DragHandle = "nw" | "ne" | "sw" | "se" | "n" | "s" | "e" | "w" | "move" | null;

interface CropRect {
  x: number; y: number; w: number; h: number; // in image-pixel coords
}

const MIN_SIZE = 20; // px minimum crop size

export default function ImageCropper() {
  const uid = useId();
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef       = useRef<HTMLImageElement | null>(null);

  const [file, setFile]           = useState<File | null>(null);
  const [imgUrl, setImgUrl]       = useState<string | null>(null);
  const [naturalW, setNaturalW]   = useState(0);
  const [naturalH, setNaturalH]   = useState(0);
  const [displayW, setDisplayW]   = useState(0);  // canvas display size
  const [displayH, setDisplayH]   = useState(0);

  const [crop, setCrop]           = useState<CropRect>({ x: 0, y: 0, w: 0, h: 0 });
  const [ratio, setRatio]         = useState<AspectRatio>("free");
  const [outputFmt, setOutputFmt] = useState<ImageOutputFormat>("image/jpeg");

  const [converting, setConverting] = useState(false);
  const [resultBlob, setResultBlob]  = useState<Blob | null>(null);
  const [resultName, setResultName]  = useState<string>("");
  const [done, setDone]             = useState(false);

  const dragState = useRef<{
    handle: DragHandle;
    startX: number; startY: number;
    startCrop: CropRect;
  } | null>(null);

  // ── Scale helpers ────────────────────────────────────────────────────────
  const scale = displayW > 0 ? displayW / naturalW : 1; // display / natural

  const toDisplay  = (v: number) => v * scale;
  const toNatural  = (v: number) => v / scale;

  // ── Load image ───────────────────────────────────────────────────────────
  const loadFile = useCallback((files: File[]) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setDone(false);
    setResultBlob(null);

    const url = URL.createObjectURL(f);
    setImgUrl(url);

    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      setNaturalW(img.naturalWidth);
      setNaturalH(img.naturalHeight);
    };
    img.src = url;
  }, []);

  // ── Size canvas to container ─────────────────────────────────────────────
  useEffect(() => {
    if (!naturalW || !naturalH || !containerRef.current) return;
    const maxW = containerRef.current.clientWidth || 700;
    const scaleToFit = Math.min(1, maxW / naturalW);
    const dW = Math.round(naturalW * scaleToFit);
    const dH = Math.round(naturalH * scaleToFit);
    setDisplayW(dW);
    setDisplayH(dH);
    // Default crop = full image
    setCrop({ x: 0, y: 0, w: naturalW, h: naturalH });
  }, [naturalW, naturalH]);

  // ── Draw canvas ──────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const img    = imgRef.current;
    if (!canvas || !img || !displayW || !displayH) return;
    canvas.width  = displayW;
    canvas.height = displayH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(img, 0, 0, displayW, displayH);

    // Darken outside crop
    const cx = toDisplay(crop.x);
    const cy = toDisplay(crop.y);
    const cw = toDisplay(crop.w);
    const ch = toDisplay(crop.h);

    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.fillRect(0, 0, displayW, displayH);
    ctx.clearRect(cx, cy, cw, ch);
    ctx.drawImage(img, crop.x, crop.y, crop.w, crop.h, cx, cy, cw, ch);

    // Crop border
    ctx.strokeStyle = "#6366f1";
    ctx.lineWidth = 2;
    ctx.strokeRect(cx, cy, cw, ch);

    // Rule-of-thirds grid
    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.lineWidth = 1;
    for (let i = 1; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(cx + (cw / 3) * i, cy);
      ctx.lineTo(cx + (cw / 3) * i, cy + ch);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx, cy + (ch / 3) * i);
      ctx.lineTo(cx + cw, cy + (ch / 3) * i);
      ctx.stroke();
    }

    // Corner handles
    const hs = 8;
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#6366f1";
    ctx.lineWidth = 2;
    const corners: [number, number][] = [
      [cx, cy], [cx + cw, cy], [cx, cy + ch], [cx + cw, cy + ch],
    ];
    for (const [hx, hy] of corners) {
      ctx.fillRect(hx - hs / 2, hy - hs / 2, hs, hs);
      ctx.strokeRect(hx - hs / 2, hy - hs / 2, hs, hs);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [crop, displayW, displayH, imgUrl]);

  // ── Constrain crop to image bounds ───────────────────────────────────────
  const clampCrop = useCallback((r: CropRect, aspectRatio: AspectRatio): CropRect => {
    const rInfo = RATIOS.find(a => a.value === aspectRatio);
    let { x, y, w, h } = r;

    if (rInfo?.ratio) {
      h = w / rInfo.ratio;
    }

    w = Math.max(MIN_SIZE, w);
    h = Math.max(MIN_SIZE, h);
    x = Math.max(0, Math.min(x, naturalW - w));
    y = Math.max(0, Math.min(y, naturalH - h));
    w = Math.min(w, naturalW - x);
    h = Math.min(h, naturalH - y);

    return { x, y, w, h };
  }, [naturalW, naturalH]);

  // ── Apply ratio change ───────────────────────────────────────────────────
  const handleRatioChange = (newRatio: AspectRatio) => {
    setRatio(newRatio);
    if (newRatio !== "free") {
      setCrop(prev => clampCrop(prev, newRatio));
    }
  };

  // ── Hit-test handle ──────────────────────────────────────────────────────
  const getHandle = (mx: number, my: number): DragHandle => {
    const cx = toDisplay(crop.x);
    const cy = toDisplay(crop.y);
    const cw = toDisplay(crop.w);
    const ch = toDisplay(crop.h);
    const T = 12; // tolerance px

    const nearL  = Math.abs(mx - cx) < T;
    const nearR  = Math.abs(mx - (cx + cw)) < T;
    const nearT  = Math.abs(my - cy) < T;
    const nearB  = Math.abs(my - (cy + ch)) < T;
    const insideX = mx > cx + T && mx < cx + cw - T;
    const insideY = my > cy + T && my < cy + ch - T;

    if (nearL  && nearT)  return "nw";
    if (nearR  && nearT)  return "ne";
    if (nearL  && nearB)  return "sw";
    if (nearR  && nearB)  return "se";
    if (nearT  && insideX) return "n";
    if (nearB  && insideX) return "s";
    if (nearL  && insideY) return "w";
    if (nearR  && insideY) return "e";
    if (insideX && insideY) return "move";
    return null;
  };

  const getCursor = (handle: DragHandle): string => {
    const map: Record<string, string> = {
      nw: "nw-resize", ne: "ne-resize", sw: "sw-resize", se: "se-resize",
      n: "n-resize", s: "s-resize", e: "e-resize", w: "w-resize",
      move: "move",
    };
    return handle ? (map[handle] ?? "default") : "default";
  };

  // ── Mouse events ─────────────────────────────────────────────────────────
  const getCanvasPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasPos(e);
    const handle = getHandle(x, y);
    if (!handle) return;
    dragState.current = { handle, startX: x, startY: y, startCrop: { ...crop } };
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasPos(e);

    // Update cursor
    if (!dragState.current) {
      const h = getHandle(x, y);
      canvasRef.current!.style.cursor = getCursor(h);
      return;
    }

    const ds  = dragState.current;
    const dx  = toNatural(x - ds.startX);
    const dy  = toNatural(y - ds.startY);
    const sc  = ds.startCrop;
    let { x: nx, y: ny, w: nw, h: nh } = sc;

    switch (ds.handle) {
      case "move": nx = sc.x + dx; ny = sc.y + dy; break;
      case "se":   nw = sc.w + dx; nh = sc.h + dy; break;
      case "nw":   nx = sc.x + dx; ny = sc.y + dy; nw = sc.w - dx; nh = sc.h - dy; break;
      case "ne":   ny = sc.y + dy; nw = sc.w + dx; nh = sc.h - dy; break;
      case "sw":   nx = sc.x + dx; nw = sc.w - dx; nh = sc.h + dy; break;
      case "n":    ny = sc.y + dy; nh = sc.h - dy; break;
      case "s":    nh = sc.h + dy; break;
      case "e":    nw = sc.w + dx; break;
      case "w":    nx = sc.x + dx; nw = sc.w - dx; break;
    }

    setCrop(clampCrop({ x: nx, y: ny, w: nw, h: nh }, ratio));
  };

  const handleMouseUp = () => { dragState.current = null; };

  // ── Touch support ────────────────────────────────────────────────────────
  const toCanvasTouchPos = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const t = e.touches[0];
    return { x: t.clientX - rect.left, y: t.clientY - rect.top };
  };

  // ── Crop & download ──────────────────────────────────────────────────────
  const handleCrop = async () => {
    if (!file) return;
    setConverting(true);
    try {
      const result = await cropImage(file, {
        x: Math.round(crop.x),
        y: Math.round(crop.y),
        width: Math.round(crop.w),
        height: Math.round(crop.h),
      }, outputFmt, 0.92);
      setResultBlob(result.blob);
      setResultName(result.fileName);
      setDone(true);
    } catch {
      alert("Crop failed. Please try again.");
    } finally {
      setConverting(false);
    }
  };

  const handleDownload = () => {
    if (resultBlob && resultName) triggerDownload(resultBlob, resultName);
  };

  const handleReset = () => {
    if (imgUrl) URL.revokeObjectURL(imgUrl);
    setFile(null); setImgUrl(null);
    setNaturalW(0); setNaturalH(0);
    setDone(false); setResultBlob(null);
    imgRef.current = null;
  };

  // ── Crop info ────────────────────────────────────────────────────────────
  const cropW = Math.round(crop.w);
  const cropH = Math.round(crop.h);

  // ── Render ───────────────────────────────────────────────────────────────
  if (!file) {
    return (
      <DropZone
        onFilesAdded={loadFile}
        acceptedTypes={ACCEPTED}
        maxSizeMB={50}
        maxFiles={1}
        currentCount={0}
      />
    );
  }

  return (
    <div className="w-full space-y-5">
      {/* Canvas crop area */}
      {!done && (
        <div ref={containerRef} className="w-full">
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-900">
            {/* Dark toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3
                            bg-slate-900 border-b border-slate-700/60">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest mr-1">
                  Ratio
                </span>
                {RATIOS.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => handleRatioChange(r.value)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      ratio === r.value
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
              <span className="text-xs font-mono text-slate-400 tabular-nums">
                {cropW} × {cropH} px
              </span>
            </div>

            {/* Canvas */}
            <div className="flex items-center justify-center p-3 bg-[#0f1117]">
              <canvas
                ref={canvasRef}
                style={{ maxWidth: "100%", display: "block" }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              />
            </div>
          </div>
        </div>
      )}

      {/* Result preview after crop */}
      {done && resultBlob && (
        <div className="rounded-2xl overflow-hidden border border-emerald-200 shadow-sm">
          <div className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-900">
            <div className="p-1.5 rounded-lg bg-emerald-500/20">
              <Crop className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-sm font-semibold text-white">Crop complete</p>
            <span className="ml-auto text-xs text-slate-400 font-mono tabular-nums">
              {cropW} × {cropH} px · {formatBytes(resultBlob.size)}
            </span>
          </div>
          <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={URL.createObjectURL(resultBlob)}
              alt="Cropped result"
              className="max-w-full max-h-64 rounded-xl shadow-md object-contain"
            />
          </div>
        </div>
      )}

      {/* Controls row */}
      {!done && (
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          {/* Output format */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest whitespace-nowrap">
              Save as
            </span>
            <div className="flex rounded-xl overflow-hidden border border-slate-200 divide-x divide-slate-200">
              {OUTPUT_FORMATS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setOutputFmt(f.value)}
                  className={`px-3 py-1.5 text-xs font-semibold transition-all ${
                    outputFmt === f.value
                      ? "bg-slate-900 text-white"
                      : "bg-white text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Crop button */}
          <button
            onClick={handleCrop}
            disabled={converting}
            className="flex-1 flex items-center justify-center gap-2.5
                       py-3.5 px-8 rounded-2xl font-semibold text-white text-sm
                       bg-gradient-to-r from-slate-900 via-indigo-700 to-indigo-600
                       hover:from-slate-800 hover:via-indigo-600 hover:to-indigo-500
                       disabled:opacity-60 disabled:cursor-not-allowed
                       shadow-[0_4px_20px_rgba(79,70,229,0.4)]
                       hover:shadow-[0_6px_28px_rgba(79,70,229,0.5)]
                       hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            {converting
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Cropping…</>
              : <><Crop className="w-4 h-4" /> Crop & Save ({cropW} × {cropH})</>
            }
          </button>
        </div>
      )}

      {/* Download / reset */}
      {done && (
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2
                       py-3.5 px-6 rounded-2xl font-semibold text-white text-sm
                       bg-gradient-to-r from-slate-900 via-indigo-700 to-indigo-600
                       hover:from-slate-800 hover:via-indigo-600 hover:to-indigo-500
                       shadow-[0_4px_20px_rgba(79,70,229,0.35)]
                       hover:-translate-y-0.5 transition-all duration-200"
          >
            <Download className="w-4 h-4" />
            Download {outputFmt.split("/")[1].toUpperCase()}
          </button>
          <button
            onClick={handleReset}
            className="flex items-center justify-center gap-2
                       py-3.5 px-6 rounded-2xl font-semibold text-sm
                       text-slate-600 bg-slate-100 hover:bg-slate-200
                       transition-all duration-200"
          >
            <RotateCcw className="w-4 h-4" />
            Crop Another
          </button>
        </div>
      )}
    </div>
  );
}

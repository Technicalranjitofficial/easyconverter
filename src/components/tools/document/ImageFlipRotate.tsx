"use client";
import { useState, useCallback, useRef } from "react";
import { Loader2, Download, RotateCcw, FlipHorizontal2 } from "lucide-react";
import DropZone from "@/components/tools/shared/DropZone";
import { triggerDownload } from "@/lib/utils/downloadUtils";

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];
type Operation = "rotate-cw" | "rotate-ccw" | "flip-h" | "flip-v";

const OPS: { value: Operation; label: string; icon: string }[] = [
  { value: "rotate-cw",  label: "Rotate 90° CW",   icon: "↻" },
  { value: "rotate-ccw", label: "Rotate 90° CCW",  icon: "↺" },
  { value: "flip-h",     label: "Flip Horizontal",  icon: "⇔" },
  { value: "flip-v",     label: "Flip Vertical",    icon: "⇕" },
];

async function applyOp(file: File, op: Operation): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const swap = op === "rotate-cw" || op === "rotate-ccw";
      canvas.width  = swap ? img.height : img.width;
      canvas.height = swap ? img.width  : img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.save();
      if (op === "rotate-cw")  { ctx.translate(canvas.width, 0); ctx.rotate(Math.PI/2); }
      if (op === "rotate-ccw") { ctx.translate(0, canvas.height); ctx.rotate(-Math.PI/2); }
      if (op === "flip-h")     { ctx.translate(canvas.width, 0); ctx.scale(-1, 1); }
      if (op === "flip-v")     { ctx.translate(0, canvas.height); ctx.scale(1, -1); }
      ctx.drawImage(img, 0, 0);
      ctx.restore();
      URL.revokeObjectURL(url);
      canvas.toBlob(b => b ? resolve(b) : reject(new Error("Canvas failed")), file.type, 0.95);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Failed to load image")); };
    img.src = url;
  });
}

export default function ImageFlipRotate() {
  const [file, setFile]           = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [op, setOp]               = useState<Operation>("rotate-cw");
  const [loading, setLoading]     = useState(false);

  const handleFile = useCallback((files: File[]) => {
    const f = files[0]; if (!f) return;
    setFile(f);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(f));
  }, [previewUrl]);

  const apply = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const blob = await applyOp(file, op);
      const ext  = file.type.split("/")[1];
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      const newUrl = URL.createObjectURL(blob);
      setPreviewUrl(newUrl);
      setFile(new File([blob], file.name, { type: file.type }));
      triggerDownload(blob, file.name.replace(/\.[^.]+$/, `-${op}.${ext}`));
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setFile(null); if (previewUrl) URL.revokeObjectURL(previewUrl); setPreviewUrl(null); };

  return (
    <div className="w-full space-y-5">
      {!file && <DropZone onFilesAdded={handleFile} acceptedTypes={ACCEPTED} maxSizeMB={50} maxFiles={1} currentCount={0} />}
      {file && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {OPS.map(o => (
              <button key={o.value} onClick={() => setOp(o.value)}
                className={`flex flex-col items-center gap-1 py-3 rounded-xl border text-sm font-semibold transition-all ${
                  op === o.value ? "border-indigo-400 bg-indigo-600 text-white" : "border-slate-200 text-slate-600 hover:border-slate-300 bg-white"
                }`}>
                <span className="text-2xl leading-none">{o.icon}</span>
                <span className="text-xs">{o.label}</span>
              </button>
            ))}
          </div>
          {previewUrl && (
            <div className="flex justify-center p-4 bg-slate-100 rounded-2xl border border-slate-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="Preview" className="max-h-64 max-w-full rounded-xl object-contain shadow-md" />
            </div>
          )}
          <div className="flex gap-3">
            <button onClick={apply} disabled={loading}
              className="flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-2xl font-semibold text-white text-sm
                         bg-gradient-to-r from-slate-900 via-indigo-700 to-indigo-600
                         hover:-translate-y-0.5 disabled:opacity-50 shadow-[0_4px_20px_rgba(79,70,229,0.35)] transition-all">
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" />Applying…</> : <><FlipHorizontal2 className="w-5 h-5" />Apply & Download</>}
            </button>
            <button onClick={reset}
              className="flex items-center gap-2 py-3.5 px-5 rounded-2xl font-semibold text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all">
              <RotateCcw className="w-4 h-4" />Reset
            </button>
          </div>
        </>
      )}
    </div>
  );
}

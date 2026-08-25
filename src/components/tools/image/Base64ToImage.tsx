"use client";

import { useState } from "react";
import { Loader2, Download, RotateCcw, Wand2 } from "lucide-react";
import { base64ToImage, type ImageOutputFormat } from "@/lib/converters/imageConverter";
import { triggerDownload } from "@/lib/utils/downloadUtils";
import { formatBytes } from "@/lib/utils/fileUtils";

const OUTPUT_FORMATS: { label: string; value: ImageOutputFormat }[] = [
  { label: "PNG",  value: "image/png"  },
  { label: "JPG",  value: "image/jpeg" },
  { label: "WebP", value: "image/webp" },
];

export default function Base64ToImage() {
  const [input, setInput]     = useState("");
  const [fmt, setFmt]         = useState<ImageOutputFormat>("image/png");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [result, setResult]   = useState<{ blob: Blob; fileName: string; width: number; height: number } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleDecode = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const r = await base64ToImage(input.trim(), fmt);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      const url = URL.createObjectURL(r.blob);
      setPreviewUrl(url);
      setResult(r);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid Base64 input.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (result) triggerDownload(result.blob, result.fileName);
  };

  const reset = () => {
    setInput(""); setResult(null); setError(null);
    if (previewUrl) { URL.revokeObjectURL(previewUrl); setPreviewUrl(null); }
  };

  return (
    <div className="w-full space-y-5">
      {/* Input area */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
          Paste Base64 String or Data URI
        </label>
        <textarea
          rows={6}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={"data:image/png;base64,iVBORw0KGgo...\nor paste raw base64 string"}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-mono
                     text-slate-600 bg-white resize-none placeholder-slate-300
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                     transition-all"
        />
        {error && (
          <p className="text-sm text-red-500 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
            {error}
          </p>
        )}
      </div>

      {/* Output format + decode button */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest whitespace-nowrap">
            Save as
          </span>
          <div className="flex rounded-xl overflow-hidden border border-slate-200 divide-x divide-slate-200">
            {OUTPUT_FORMATS.map(f => (
              <button
                key={f.value}
                onClick={() => setFmt(f.value)}
                className={`px-3 py-1.5 text-xs font-semibold transition-all ${
                  fmt === f.value ? "bg-slate-900 text-white" : "bg-white text-slate-500 hover:bg-slate-50"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleDecode}
          disabled={loading || !input.trim()}
          className="flex-1 flex items-center justify-center gap-2.5
                     py-3.5 px-8 rounded-2xl font-semibold text-white text-sm
                     bg-gradient-to-r from-slate-900 via-indigo-700 to-indigo-600
                     hover:from-slate-800 hover:via-indigo-600 hover:to-indigo-500
                     disabled:opacity-50 disabled:cursor-not-allowed
                     shadow-[0_4px_20px_rgba(79,70,229,0.4)]
                     hover:-translate-y-0.5 transition-all duration-200"
        >
          {loading
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Decoding…</>
            : <><Wand2 className="w-4 h-4" /> Decode to Image</>
          }
        </button>
      </div>

      {/* Result */}
      {result && previewUrl && (
        <div className="rounded-2xl overflow-hidden border border-emerald-200 shadow-sm animate-slide-up">
          <div className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-900">
            <p className="text-sm font-semibold text-white">Image decoded successfully</p>
            <span className="ml-auto text-xs text-slate-400 font-mono tabular-nums">
              {result.width} × {result.height} px · {formatBytes(result.blob.size)}
            </span>
          </div>
          <div className="p-4 bg-emerald-50 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="Decoded" className="max-h-64 max-w-full rounded-xl object-contain shadow-md" />
          </div>
          <div className="flex gap-3 p-4 bg-white border-t border-slate-100">
            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2
                         py-3 px-6 rounded-xl font-semibold text-white text-sm
                         bg-gradient-to-r from-slate-900 via-indigo-700 to-indigo-600
                         hover:-translate-y-0.5 transition-all"
            >
              <Download className="w-4 h-4" />
              Download {fmt.split("/")[1].toUpperCase()}
            </button>
            <button
              onClick={reset}
              className="flex items-center justify-center gap-2
                         py-3 px-5 rounded-xl font-semibold text-sm
                         text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

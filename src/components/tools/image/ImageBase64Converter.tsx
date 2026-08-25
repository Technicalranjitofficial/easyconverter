"use client";

import { useState, useCallback } from "react";
import { Copy, Check, FileCode2 } from "lucide-react";
import DropZone from "@/components/tools/shared/DropZone";
import { imageToBase64, type Base64Result } from "@/lib/converters/imageConverter";
import { formatBytes } from "@/lib/utils/fileUtils";

const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];

type CopyTarget = "datauri" | "raw" | null;

export default function ImageBase64Converter() {
  const [result, setResult]   = useState<Base64Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied]   = useState<CopyTarget>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFile = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setLoading(true);
    try {
      const r = await imageToBase64(file);
      setResult(r);
      setPreviewUrl(r.dataUri);
    } catch {
      alert("Failed to encode image.");
    } finally {
      setLoading(false);
    }
  }, []);

  const copyTo = async (target: CopyTarget) => {
    if (!result) return;
    const text = target === "datauri" ? result.dataUri : result.rawBase64;
    await navigator.clipboard.writeText(text);
    setCopied(target);
    setTimeout(() => setCopied(null), 2000);
  };

  const reset = () => { setResult(null); setPreviewUrl(null); };

  return (
    <div className="w-full space-y-5">
      {!result && (
        <DropZone
          onFilesAdded={handleFile}
          acceptedTypes={ACCEPTED}
          maxSizeMB={10}
          maxFiles={1}
          currentCount={0}
          disabled={loading}
        />
      )}

      {loading && (
        <div className="flex items-center justify-center py-8 text-sm text-slate-400 gap-2">
          <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          Encoding image…
        </div>
      )}

      {result && (
        <div className="space-y-4 animate-slide-up">
          {/* Info bar */}
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-900">
              <FileCode2 className="w-4 h-4 text-indigo-400" />
              <p className="text-sm font-semibold text-white">{result.fileName}</p>
              <span className="ml-auto text-xs text-slate-400 font-mono">
                {formatBytes(result.originalSize)} → {formatBytes(result.encodedLength)} encoded
              </span>
            </div>

            {/* Preview */}
            {previewUrl && (
              <div className="bg-[repeating-conic-gradient(#f0f0f0_0%_25%,#ffffff_0%_50%)] bg-[length:20px_20px] p-4 flex justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewUrl} alt="Preview" className="max-h-36 max-w-full object-contain rounded-lg shadow" />
              </div>
            )}
          </div>

          {/* Data URI */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Data URI (HTML / CSS ready)
              </label>
              <button
                onClick={() => copyTo("datauri")}
                className="flex items-center gap-1.5 text-xs font-semibold
                           px-3 py-1.5 rounded-lg bg-slate-900 text-white
                           hover:bg-slate-700 transition-colors"
              >
                {copied === "datauri" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied === "datauri" ? "Copied!" : "Copy"}
              </button>
            </div>
            <textarea
              readOnly
              rows={3}
              value={result.dataUri}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-mono
                         text-slate-600 bg-slate-50 resize-none focus:outline-none
                         scrollbar-thin"
            />
          </div>

          {/* Raw Base64 */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Raw Base64 String
              </label>
              <button
                onClick={() => copyTo("raw")}
                className="flex items-center gap-1.5 text-xs font-semibold
                           px-3 py-1.5 rounded-lg bg-slate-900 text-white
                           hover:bg-slate-700 transition-colors"
              >
                {copied === "raw" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied === "raw" ? "Copied!" : "Copy"}
              </button>
            </div>
            <textarea
              readOnly
              rows={3}
              value={result.rawBase64}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-mono
                         text-slate-600 bg-slate-50 resize-none focus:outline-none"
            />
          </div>

          <button
            onClick={reset}
            className="w-full py-3 rounded-2xl text-sm font-semibold
                       text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Encode Another Image
          </button>
        </div>
      )}
    </div>
  );
}

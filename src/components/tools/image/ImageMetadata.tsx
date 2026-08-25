"use client";

import { useState, useCallback } from "react";
import { Copy, Check, Download, RotateCcw, Info } from "lucide-react";
import DropZone from "@/components/tools/shared/DropZone";
import { extractImageMetadata, type ImageMetadata } from "@/lib/converters/imageConverter";
import { formatBytes } from "@/lib/utils/fileUtils";

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

export default function ImageMetadataViewer() {
  const [meta, setMeta]         = useState<ImageMetadata | null>(null);
  const [loading, setLoading]   = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [copied, setCopied]     = useState(false);

  const handleFile = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setLoading(true);
    try {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      const m = await extractImageMetadata(file);
      setMeta(m);
    } catch {
      alert("Failed to read metadata.");
    } finally {
      setLoading(false);
    }
  }, []);

  const copyJson = async () => {
    if (!meta) return;
    await navigator.clipboard.writeText(JSON.stringify(meta, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadJson = () => {
    if (!meta) return;
    const blob = new Blob([JSON.stringify(meta, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${meta.fileName}-metadata.json`; a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setMeta(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  const MetaRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-start gap-3 py-2.5 border-b border-slate-100 last:border-0">
      <span className="text-xs font-semibold text-slate-400 min-w-[120px] flex-shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-slate-700 font-mono break-all">{value}</span>
    </div>
  );

  const coreFields = meta ? [
    ["File Name",    meta.fileName],
    ["File Size",    formatBytes(meta.fileSize)],
    ["Format",       meta.mimeType],
    ["Dimensions",   `${meta.width} × ${meta.height} px`],
    ["Megapixels",   `${meta.megapixels} MP`],
    ["Aspect Ratio", meta.aspectRatio],
  ] : [];

  return (
    <div className="w-full space-y-5">
      {!meta && !loading && (
        <DropZone onFilesAdded={handleFile} acceptedTypes={ACCEPTED} maxSizeMB={50} maxFiles={1} currentCount={0} />
      )}

      {loading && (
        <div className="flex items-center justify-center py-10 text-slate-400 gap-2 text-sm">
          <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          Reading metadata…
        </div>
      )}

      {meta && (
        <div className="space-y-4 animate-slide-up">
          {/* Header with preview */}
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-900">
              <Info className="w-4 h-4 text-indigo-400" />
              <p className="text-sm font-semibold text-white truncate">{meta.fileName}</p>
              <div className="ml-auto flex gap-2">
                <button
                  onClick={copyJson}
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5
                             bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied" : "Copy JSON"}
                </button>
                <button
                  onClick={downloadJson}
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5
                             bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export
                </button>
              </div>
            </div>

            {previewUrl && (
              <div className="flex items-center gap-4 p-4 bg-slate-50 border-b border-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewUrl} alt="Preview" className="w-16 h-16 object-cover rounded-xl border border-slate-200 flex-shrink-0" />
                <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                  <span className="text-slate-400">Dimensions</span>
                  <span className="font-semibold text-slate-800">{meta.width} × {meta.height}</span>
                  <span className="text-slate-400">Size</span>
                  <span className="font-semibold text-slate-800">{formatBytes(meta.fileSize)}</span>
                  <span className="text-slate-400">Format</span>
                  <span className="font-semibold text-slate-800">{meta.mimeType.split("/")[1].toUpperCase()}</span>
                </div>
              </div>
            )}
          </div>

          {/* Core fields */}
          <div className="rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-4 py-2 bg-slate-50 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">File Information</span>
            </div>
            <div className="px-4 divide-y divide-slate-50">
              {coreFields.map(([label, value]) => (
                <MetaRow key={label} label={label} value={value} />
              ))}
            </div>
          </div>

          {/* EXIF */}
          {Object.keys(meta.exif).length > 0 && (
            <div className="rounded-2xl border border-slate-200 overflow-hidden">
              <div className="px-4 py-2 bg-slate-50 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  EXIF Data ({Object.keys(meta.exif).length} fields)
                </span>
              </div>
              <div className="px-4 divide-y divide-slate-50">
                {Object.entries(meta.exif).map(([k, v]) => (
                  <MetaRow key={k} label={k} value={v} />
                ))}
              </div>
            </div>
          )}

          {Object.keys(meta.exif).length === 0 && meta.mimeType === "image/jpeg" && (
            <p className="text-sm text-slate-400 text-center py-2">
              No EXIF data found — this image may have had metadata stripped.
            </p>
          )}

          <button
            onClick={reset}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold
                       text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Check Another Image
          </button>
        </div>
      )}
    </div>
  );
}

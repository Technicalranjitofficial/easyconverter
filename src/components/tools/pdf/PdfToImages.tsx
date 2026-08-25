"use client";

import { useState, useCallback } from "react";
import { Loader2, Images, Download, RotateCcw, FileText } from "lucide-react";
import PdfDropZone from "./PdfDropZone";
import { pdfToImages, getPdfInfo, type PdfPageImage } from "@/lib/converters/pdfConverter";
import { formatBytes } from "@/lib/utils/fileUtils";
import { triggerDownload } from "@/lib/utils/downloadUtils";

interface Props {
  outputFormat: "image/jpeg" | "image/png";
  outputExt: "jpg" | "png";
}

const SCALES = [
  { value: 1.5, label: "72 DPI",  desc: "Fastest" },
  { value: 2,   label: "144 DPI", desc: "Default" },
  { value: 4,   label: "288 DPI", desc: "High quality" },
];

export default function PdfToImages({ outputFormat, outputExt }: Props) {
  const [file, setFile]       = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [scale, setScale]     = useState(2);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [images, setImages]   = useState<PdfPageImage[]>([]);

  const handleFile = useCallback(async (files: File[]) => {
    const f = files[0]; if (!f) return;
    setFile(f); setImages([]);
    const info = await getPdfInfo(f);
    setPageCount(info.pageCount);
  }, []);

  const handleConvert = async () => {
    if (!file) return;
    setLoading(true);
    setProgress({ done: 0, total: pageCount });
    try {
      const imgs = await pdfToImages(
        file,
        { format: outputFormat, scale, quality: 0.92 },
        (done, total) => setProgress({ done, total })
      );
      setImages(imgs);
    } catch (e) {
      alert(`Conversion failed: ${e instanceof Error ? e.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const downloadAll = async () => {
    if (!images.length) return;
    if (images.length === 1) { triggerDownload(images[0].blob, images[0].fileName); return; }
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();
    images.forEach(img => zip.file(img.fileName, img.blob));
    const zipBlob = await zip.generateAsync({ type: "blob" });
    triggerDownload(zipBlob, `${file!.name.replace(".pdf", "")}-pages.zip`);
  };

  const reset = () => { setFile(null); setImages([]); setPageCount(0); };

  return (
    <div className="w-full space-y-5">
      {!file && <PdfDropZone onFilesAdded={handleFile} multiple={false} />}

      {file && !images.length && (
        <>
          {/* File info */}
          <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-white">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-red-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700 truncate">{file.name}</p>
              <p className="text-xs text-slate-400">{pageCount} pages · {formatBytes(file.size)}</p>
            </div>
          </div>

          {/* DPI selector */}
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
            <div className="px-4 py-2.5 bg-slate-900 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">Output Quality</span>
            </div>
            <div className="p-4 bg-white grid grid-cols-3 gap-2">
              {SCALES.map(s => (
                <button key={s.value} onClick={() => setScale(s.value)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    scale === s.value ? "border-indigo-400 bg-indigo-50" : "border-slate-200 hover:border-slate-300"
                  }`}>
                  <p className={`text-xs font-bold mb-0.5 ${scale === s.value ? "text-indigo-700" : "text-slate-700"}`}>{s.label}</p>
                  <p className="text-[11px] text-slate-400">{s.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Progress bar (during conversion) */}
          {loading && progress.total > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Converting page {progress.done} of {progress.total}…</span>
                <span>{Math.round((progress.done / progress.total) * 100)}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                  style={{ width: `${(progress.done / progress.total) * 100}%` }}
                />
              </div>
            </div>
          )}

          <button onClick={handleConvert} disabled={loading}
            className="w-full flex items-center justify-center gap-2.5
                       py-4 rounded-2xl font-semibold text-white text-base
                       bg-gradient-to-r from-slate-900 via-indigo-700 to-indigo-600
                       hover:from-slate-800 hover:via-indigo-600 hover:to-indigo-500
                       disabled:opacity-60 shadow-[0_4px_20px_rgba(79,70,229,0.4)]
                       hover:-translate-y-0.5 transition-all duration-200">
            {loading
              ? <><Loader2 className="w-5 h-5 animate-spin" />Converting…</>
              : <><Images className="w-5 h-5" />Convert {pageCount} page{pageCount !== 1 ? "s" : ""} to {outputExt.toUpperCase()}</>
            }
          </button>
        </>
      )}

      {images.length > 0 && (
        <div className="space-y-4 animate-slide-up">
          {/* Summary */}
          <div className="rounded-2xl overflow-hidden border border-emerald-200 shadow-sm">
            <div className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-900">
              <Images className="w-4 h-4 text-emerald-400" />
              <p className="text-sm font-semibold text-white">{images.length} {outputExt.toUpperCase()} images ready</p>
              <span className="ml-auto text-xs text-slate-400">{images[0].width} × {images[0].height} px</span>
            </div>

            {/* Thumbnail strip */}
            <div className="flex gap-2 p-3 overflow-x-auto bg-slate-50">
              {images.slice(0, 8).map(img => (
                <div key={img.pageNumber} className="flex-shrink-0 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={URL.createObjectURL(img.blob)}
                    alt={`Page ${img.pageNumber}`}
                    className="h-20 w-auto rounded-lg border border-slate-200 shadow-sm object-cover"
                  />
                  <span className="absolute bottom-1 right-1 text-[9px] bg-black/50 text-white px-1 rounded">
                    {img.pageNumber}
                  </span>
                </div>
              ))}
              {images.length > 8 && (
                <div className="flex-shrink-0 h-20 w-14 rounded-lg border border-slate-200 bg-slate-100
                                flex items-center justify-center text-xs text-slate-400 font-medium">
                  +{images.length - 8}
                </div>
              )}
            </div>

            <div className="flex gap-3 p-4 bg-emerald-50 border-t border-emerald-100">
              <button onClick={downloadAll}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white text-sm
                           bg-gradient-to-r from-slate-900 via-indigo-700 to-indigo-600 hover:-translate-y-0.5 transition-all">
                <Download className="w-4 h-4" />
                {images.length === 1 ? `Download ${outputExt.toUpperCase()}` : `Download All as ZIP`}
              </button>
              <button onClick={reset}
                className="flex items-center gap-2 py-3 px-5 rounded-xl text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-all">
                <RotateCcw className="w-4 h-4" /> Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

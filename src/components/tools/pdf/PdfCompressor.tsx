"use client";

import { useState, useCallback, useId } from "react";
import { Loader2, Minimize2, Download, RotateCcw, FileText, AlertCircle, Info } from "lucide-react";
import PdfDropZone from "./PdfDropZone";
import PdfPagePreview from "./PdfPagePreview";
import { compressPdf, hasPdfImages, type CompressionLevel, type PdfPageThumb } from "@/lib/converters/pdfConverter";
import { formatBytes } from "@/lib/utils/fileUtils";
import { triggerDownload } from "@/lib/utils/downloadUtils";

interface PdfItem {
  id: string;
  file: File;
  status: "scanning" | "ready" | "compressing" | "done" | "error";
  hasImages: boolean;       // detected before compressing
  thumbs: PdfPageThumb[];
  expanded: boolean;
  result?: { blob: Blob; size: number; pages: number };
}

const LEVELS: { value: CompressionLevel; label: string; desc: string; badge: string }[] = [
  { value: "screen", label: "Maximum",      desc: "Images 40% quality, 60% scale", badge: "bg-red-50 text-red-600"      },
  { value: "ebook",  label: "Balanced",     desc: "Images 70% quality, 80% scale", badge: "bg-indigo-50 text-indigo-600" },
  { value: "print",  label: "High Quality", desc: "Images 85% quality, full scale", badge: "bg-green-50 text-green-600"  },
];

export default function PdfCompressor() {
  const uid = useId();
  const [items, setItems]     = useState<PdfItem[]>([]);
  const [level, setLevel]     = useState<CompressionLevel>("ebook");
  const [running, setRunning] = useState(false);
  const [allDone, setAllDone] = useState(false);

  const addFiles = useCallback(async (files: File[]) => {
    // Pre-scan each file immediately to detect if it has images
    const newItems: PdfItem[] = files.map(f => ({
      id: `${uid}-${f.name}-${f.lastModified}`,
      file: f,
      status: "scanning",
      hasImages: false,
      thumbs: [],
      expanded: false,
    }));
    setItems(prev => [...prev, ...newItems]);
    setAllDone(false);

    // Scan in parallel
    await Promise.all(newItems.map(async item => {
      try {
        const has = await hasPdfImages(item.file);
        setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: "ready", hasImages: has } : i));
      } catch {
        setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: "ready", hasImages: false } : i));
      }
    }));
  }, [uid]);

  const setThumbs = (id: string, thumbs: PdfPageThumb[]) =>
    setItems(prev => prev.map(i => i.id === id ? { ...i, thumbs } : i));

  const toggleExpand = (id: string) =>
    setItems(prev => prev.map(i => i.id === id ? { ...i, expanded: !i.expanded } : i));

  const remove = (id: string) => setItems(prev => prev.filter(i => i.id !== id));

  const handleCompress = async () => {
    const ready = items.filter(i => i.status === "ready");
    if (!ready.length) return;
    setRunning(true);
    setItems(prev => prev.map(i => i.status === "ready" ? { ...i, status: "compressing" } : i));

    await Promise.allSettled(ready.map(async item => {
      try {
        const r = await compressPdf(item.file, level);
        setItems(prev => prev.map(i => i.id === item.id
          ? { ...i, status: "done", result: { blob: r.blob, size: r.resultSize, pages: r.pageCount } }
          : i));
      } catch {
        setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: "error" } : i));
      }
    }));

    setRunning(false);
    setAllDone(true);
  };

  const readyItems = items.filter(i => i.status === "ready");
  const doneItems  = items.filter(i => i.status === "done");
  const textOnlyCount = readyItems.filter(i => !i.hasImages).length;
  const imageCount    = readyItems.filter(i => i.hasImages).length;

  return (
    <div className="w-full space-y-5">
      {!allDone && <PdfDropZone onFilesAdded={addFiles} disabled={running} />}

      {!allDone && items.length > 0 && (
        <div className="space-y-3">
          {/* Compression level */}
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
            <div className="px-4 py-2.5 bg-slate-900 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">Compression Level</span>
            </div>
            <div className="grid grid-cols-3 gap-2 p-4 bg-white">
              {LEVELS.map(l => (
                <button key={l.value} onClick={() => setLevel(l.value)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    level === l.value ? "border-indigo-400 bg-indigo-50" : "border-slate-200 hover:border-slate-300"
                  }`}>
                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-1.5 ${l.badge}`}>{l.label}</span>
                  <p className="text-[11px] text-slate-400 leading-tight">{l.desc}</p>
                </button>
              ))}
            </div>

            {/* Upfront warning if any text-only PDFs detected */}
            {textOnlyCount > 0 && (
              <div className="mx-4 mb-4 flex items-start gap-2 p-3 bg-amber-50 rounded-xl border border-amber-200">
                <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-amber-800">
                    {textOnlyCount === items.filter(i => i.status === "ready").length
                      ? "This PDF contains text only — no embedded images were detected."
                      : `${textOnlyCount} of your PDFs contain text only.`}
                  </p>
                  <p className="text-xs text-amber-600 mt-0.5">
                    PDF compression works best on image-heavy files. Text-only PDFs may see minimal size reduction since text is already stored as vectors.
                  </p>
                </div>
              </div>
            )}
            {imageCount > 0 && (
              <div className="mx-4 mb-4 flex items-start gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <Info className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-700">
                  {imageCount === 1 ? "1 image-heavy PDF detected" : `${imageCount} image-heavy PDFs detected`} — expect significant savings with the selected compression level.
                </p>
              </div>
            )}
          </div>

          {/* File list */}
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
            <div className="px-4 py-2.5 bg-slate-900 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
                {items.filter(i => i.status !== "done").length} file{items.filter(i => i.status !== "done").length !== 1 ? "s" : ""} queued
              </span>
            </div>
            <div className="divide-y divide-slate-100">
              {items.filter(i => i.status !== "done").map(item => (
                <div key={item.id} className="bg-white">
                  <div className="flex items-center gap-3 px-4 py-3">
                    <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                      {(item.status === "compressing" || item.status === "scanning")
                        ? <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
                        : <FileText className="w-4 h-4 text-red-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">{item.file.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-xs text-slate-400">
                          {formatBytes(item.file.size)}
                          {item.thumbs.length > 0 && ` · ${item.thumbs.length} pages`}
                        </p>
                        {item.status === "ready" && (
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                            item.hasImages
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-amber-50 text-amber-600"
                          }`}>
                            {item.hasImages ? "Has images" : "Text only"}
                          </span>
                        )}
                        {item.status === "scanning" && (
                          <span className="text-[10px] text-slate-400">Scanning…</span>
                        )}
                      </div>
                    </div>
                    {item.status === "ready" && (
                      <>
                        <button onClick={() => toggleExpand(item.id)}
                          className="text-xs font-medium px-2.5 py-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors flex-shrink-0">
                          {item.expanded ? "Hide" : "Preview"}
                        </button>
                        <button onClick={() => remove(item.id)}
                          className="text-slate-300 hover:text-red-400 p-1 transition-colors flex-shrink-0">✕</button>
                      </>
                    )}
                  </div>

                  {item.expanded && item.status === "ready" && (
                    <div className="px-4 pb-4">
                      <PdfPagePreview
                        file={item.file}
                        selectionMode="none"
                        showLabel
                        onLoaded={t => setThumbs(item.id, t)}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {readyItems.length > 0 && (
            <button onClick={handleCompress} disabled={running}
              className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-semibold text-white
                         bg-gradient-to-r from-slate-900 via-indigo-700 to-indigo-600
                         hover:from-slate-800 hover:via-indigo-600 hover:to-indigo-500
                         disabled:opacity-60 shadow-[0_4px_20px_rgba(79,70,229,0.4)]
                         hover:-translate-y-0.5 transition-all duration-200">
              {running
                ? <><Loader2 className="w-5 h-5 animate-spin" />Compressing…</>
                : <><Minimize2 className="w-5 h-5" />Compress {readyItems.length} PDF{readyItems.length !== 1 ? "s" : ""}</>
              }
            </button>
          )}
        </div>
      )}

      {/* Results */}
      {doneItems.length > 0 && (
        <div className="space-y-2 animate-slide-up">
          <div className="px-1">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{doneItems.length} processed</span>
          </div>
          {doneItems.map(item => {
            const saving = item.result ? Math.round((1 - item.result.size / item.file.size) * 100) : 0;
            const noSavings = saving <= 2;
            return (
              <div key={item.id}
                className={`flex items-center gap-3 p-4 rounded-xl border-l-[3px] border border-slate-100 bg-white shadow-sm`}
                style={{ borderLeftColor: noSavings ? "#94a3b8" : "#10b981" }}>
                <FileText className={`w-5 h-5 flex-shrink-0 ${noSavings ? "text-slate-400" : "text-emerald-500"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">{item.file.name}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="text-xs text-slate-400">{formatBytes(item.file.size)}</span>
                    <span className="text-xs text-slate-300">→</span>
                    <span className={`text-xs font-semibold ${noSavings ? "text-slate-500" : "text-emerald-600"}`}>
                      {formatBytes(item.result!.size)}
                    </span>
                    {saving > 2 && (
                      <span className="text-[10px] font-bold text-white bg-emerald-500 px-2 py-0.5 rounded-full">-{saving}% saved</span>
                    )}
                    {noSavings && !item.hasImages && (
                      <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        Text-only — no images to compress
                      </span>
                    )}
                    {noSavings && item.hasImages && (
                      <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        Already well-optimised
                      </span>
                    )}
                  </div>
                </div>
                <button onClick={() => triggerDownload(item.result!.blob, item.file.name.replace(".pdf", "-compressed.pdf"))}
                  className={`px-3 py-1.5 rounded-lg text-white text-xs font-semibold transition-colors flex-shrink-0 ${
                    noSavings ? "bg-slate-500 hover:bg-slate-600" : "bg-slate-900 hover:bg-slate-700"
                  }`}>
                  <Download className="w-3.5 h-3.5 inline mr-1" />DL
                </button>
              </div>
            );
          })}
          <button onClick={() => { setItems([]); setAllDone(false); }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold
                       text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
            <RotateCcw className="w-4 h-4" />Compress More PDFs
          </button>
        </div>
      )}
    </div>
  );
}

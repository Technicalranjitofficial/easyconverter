"use client";

import { useState, useCallback, useId } from "react";
import { Loader2, Zap } from "lucide-react";
import DropZone from "@/components/tools/shared/DropZone";
import FileList, { type FileItem } from "@/components/tools/shared/FileList";
import ResultsPanel from "@/components/tools/shared/ResultsPanel";
import { compressImage } from "@/lib/converters/imageConverter";

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

export default function ImageCompressor() {
  const uid = useId();
  const [items, setItems] = useState<FileItem[]>([]);
  const [quality, setQuality] = useState(80);
  const [converting, setConverting] = useState(false);
  const [allDone, setAllDone] = useState(false);

  const addFiles = useCallback(
    (files: File[]) => {
      setItems((prev) => [
        ...prev,
        ...files.map((f) => ({
          id: `${uid}-${f.name}-${f.lastModified}`,
          file: f,
          status: "ready" as const,
        })),
      ]);
      setAllDone(false);
    },
    [uid]
  );

  const removeFile = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const handleCompress = async () => {
    const readyItems = items.filter((i) => i.status === "ready");
    if (!readyItems.length) return;
    setConverting(true);

    setItems((prev) =>
      prev.map((i) =>
        i.status === "ready" ? { ...i, status: "converting" as const, progress: 20 } : i
      )
    );

    await Promise.allSettled(
      readyItems.map(async (item) => {
        try {
          const result = await compressImage(item.file, quality);
          setItems((prev) =>
            prev.map((i) =>
              i.id === item.id
                ? { ...i, status: "done" as const, resultBlob: result.blob, resultName: result.fileName }
                : i
            )
          );
        } catch {
          setItems((prev) =>
            prev.map((i) =>
              i.id === item.id ? { ...i, status: "error" as const, errorMessage: "Compression failed" } : i
            )
          );
        }
      })
    );

    setConverting(false);
    setAllDone(true);
  };

  const readyCount = items.filter((i) => i.status === "ready").length;
  const doneItems = items.filter((i) => i.status === "done");

  return (
    <div className="w-full space-y-5">
      {!allDone && (
        <DropZone
          onFilesAdded={addFiles}
          acceptedTypes={ACCEPTED}
          maxSizeMB={50}
          maxFiles={20}
          currentCount={items.length}
          disabled={converting}
        />
      )}

      {/* Quality slider */}
      {!allDone && items.length > 0 && (
        <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/60 shadow-sm">
          {/* Dark header strip */}
          <div className="flex items-center justify-between px-5 py-3 bg-slate-900 dark:bg-slate-950">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-400" />
              <label className="text-sm font-semibold text-white tracking-wide">
                Compression Quality
              </label>
            </div>
            <div className="flex items-center gap-2.5">
              <span
                className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                  quality >= 85
                    ? "bg-emerald-500/20 text-emerald-300"
                    : quality >= 60
                    ? "bg-amber-500/20 text-amber-300"
                    : "bg-indigo-500/20 text-indigo-300"
                }`}
              >
                {quality >= 85 ? "High quality" : quality >= 60 ? "Balanced" : "Small file"}
              </span>
              <span className="text-base font-mono font-bold text-white tabular-nums">
                {quality}%
              </span>
            </div>
          </div>

          {/* Slider body */}
          <div className="px-5 py-4 bg-slate-50 dark:bg-slate-800/40 space-y-2.5">
            <input
              type="range"
              min={10}
              max={100}
              step={5}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full accent-indigo-500 h-2 rounded-full cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500">
              <span>Smaller file</span>
              <span>Better quality</span>
            </div>
          </div>
        </div>
      )}

      {!allDone && items.length > 0 && (
        <FileList
          items={items.filter((i) => i.status !== "done")}
          onRemove={removeFile}
        />
      )}

      {!allDone && readyCount > 0 && (
        <button
          onClick={handleCompress}
          disabled={converting}
          className="w-full flex items-center justify-center gap-2.5
                     py-4 px-8 rounded-2xl font-semibold text-white text-base
                     bg-gradient-to-r from-slate-900 via-indigo-700 to-indigo-600
                     hover:from-slate-800 hover:via-indigo-600 hover:to-indigo-500
                     disabled:opacity-60 disabled:cursor-not-allowed
                     shadow-[0_4px_20px_rgba(79,70,229,0.4)] hover:shadow-[0_6px_28px_rgba(79,70,229,0.5)]
                     hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
        >
          {converting ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Compressing…</>
          ) : (
            <><Zap className="w-5 h-5" /> Compress {readyCount} file{readyCount !== 1 ? "s" : ""} at {quality}%</>
          )}
        </button>
      )}

      {doneItems.length > 0 && (
        <ResultsPanel items={doneItems} onReset={() => { setItems([]); setAllDone(false); }} />
      )}
    </div>
  );
}

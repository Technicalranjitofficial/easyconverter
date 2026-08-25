"use client";

import { useState, useCallback, useId } from "react";
import { Loader2, Expand, Lock, Unlock } from "lucide-react";
import DropZone from "@/components/tools/shared/DropZone";
import FileList, { type FileItem } from "@/components/tools/shared/FileList";
import ResultsPanel from "@/components/tools/shared/ResultsPanel";
import { resizeImage, getImageDimensions, type ImageOutputFormat } from "@/lib/converters/imageConverter";

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

export default function ImageResizer() {
  const uid = useId();
  const [items, setItems] = useState<FileItem[]>([]);
  const [width, setWidth] = useState<string>("1920");
  const [height, setHeight] = useState<string>("1080");
  const [lockAspect, setLockAspect] = useState(true);
  const [outputFormat, setOutputFormat] = useState<ImageOutputFormat>("image/jpeg");
  const [converting, setConverting] = useState(false);
  const [allDone, setAllDone] = useState(false);

  const addFiles = useCallback(
    async (files: File[]) => {
      // Auto-fill dimensions from first image
      if (files.length === 1 && items.length === 0) {
        try {
          const dims = await getImageDimensions(files[0]);
          setWidth(String(dims.width));
          setHeight(String(dims.height));
        } catch { /* ignore */ }
      }
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
    [uid, items.length]
  );

  const removeFile = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const handleResize = async () => {
    const readyItems = items.filter((i) => i.status === "ready");
    if (!readyItems.length) return;
    const w = parseInt(width) || 0;
    const h = parseInt(height) || 0;
    if (!w && !h) return;

    setConverting(true);
    setItems((prev) =>
      prev.map((i) =>
        i.status === "ready" ? { ...i, status: "converting" as const } : i
      )
    );

    await Promise.allSettled(
      readyItems.map(async (item) => {
        try {
          const result = await resizeImage(item.file, {
            width: w,
            height: h,
            maintainAspect: lockAspect,
            outputFormat,
          });
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
              i.id === item.id ? { ...i, status: "error" as const, errorMessage: "Resize failed" } : i
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
          maxFiles={10}
          currentCount={items.length}
          disabled={converting}
        />
      )}

      {/* Resize controls */}
      {!allDone && items.length > 0 && (
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 space-y-4">
          <div className="flex items-end gap-3">
            {/* Width */}
            <div className="flex-1 space-y-1.5">
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Width (px)
              </label>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                min={1}
                max={10000}
                className="w-full px-3 py-2.5 rounded-xl text-sm font-mono
                           border border-slate-200 dark:border-slate-700
                           bg-white dark:bg-slate-900
                           text-slate-700 dark:text-slate-200
                           focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            {/* Lock button */}
            <button
              onClick={() => setLockAspect((v) => !v)}
              className={`mb-0.5 p-2.5 rounded-xl border transition-colors ${
                lockAspect
                  ? "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400"
                  : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400"
              }`}
              title={lockAspect ? "Aspect ratio locked" : "Aspect ratio unlocked"}
            >
              {lockAspect ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            </button>

            {/* Height */}
            <div className="flex-1 space-y-1.5">
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Height (px)
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                min={1}
                max={10000}
                className="w-full px-3 py-2.5 rounded-xl text-sm font-mono
                           border border-slate-200 dark:border-slate-700
                           bg-white dark:bg-slate-900
                           text-slate-700 dark:text-slate-200
                           focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          </div>

          {lockAspect && (
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <Lock className="w-3 h-3" />
              Aspect ratio locked — dimensions will be adjusted automatically
            </p>
          )}

          {/* Output format */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Output:</span>
            {(["image/jpeg", "image/png", "image/webp"] as ImageOutputFormat[]).map((fmt) => {
              const label = fmt.split("/")[1].replace("jpeg", "JPG").toUpperCase();
              return (
                <button
                  key={fmt}
                  onClick={() => setOutputFormat(fmt)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    outputFormat === fmt
                      ? "bg-indigo-500 text-white"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-600"
                  }`}
                >
                  {label}
                </button>
              );
            })}
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
          onClick={handleResize}
          disabled={converting || (!width && !height)}
          className="w-full flex items-center justify-center gap-2.5
                     py-4 px-8 rounded-2xl font-semibold text-white text-base
                     bg-gradient-to-r from-indigo-600 to-indigo-500
                     hover:from-indigo-500 hover:to-indigo-400
                     disabled:opacity-60 disabled:cursor-not-allowed
                     shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30
                     hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
        >
          {converting ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Resizing…</>
          ) : (
            <><Expand className="w-5 h-5" /> Resize {readyCount} file{readyCount !== 1 ? "s" : ""} to {width}×{height}</>
          )}
        </button>
      )}

      {doneItems.length > 0 && (
        <ResultsPanel items={doneItems} onReset={() => { setItems([]); setAllDone(false); }} />
      )}
    </div>
  );
}

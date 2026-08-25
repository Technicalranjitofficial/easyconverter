"use client";

import { useState, useCallback, useId } from "react";
import { Loader2, Wand2 } from "lucide-react";
import DropZone from "@/components/tools/shared/DropZone";
import FileList, { type FileItem } from "@/components/tools/shared/FileList";
import ResultsPanel from "@/components/tools/shared/ResultsPanel";
import { svgToPng } from "@/lib/converters/imageConverter";

const ACCEPTED = ["image/svg+xml"];

export default function ImageSvgConverter() {
  const uid = useId();
  const [items, setItems]     = useState<FileItem[]>([]);
  const [scale, setScale]     = useState<"1x" | "2x" | "4x" | "custom">("2x");
  const [customW, setCustomW] = useState(1024);
  const [converting, setConverting] = useState(false);
  const [allDone, setAllDone] = useState(false);

  const addFiles = useCallback((files: File[]) => {
    setItems(prev => [
      ...prev,
      ...files.map(f => ({ id: `${uid}-${f.name}-${f.lastModified}`, file: f, status: "ready" as const })),
    ]);
    setAllDone(false);
  }, [uid]);

  const removeFile = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const handleConvert = async () => {
    const readyItems = items.filter(i => i.status === "ready");
    if (!readyItems.length) return;
    setConverting(true);

    setItems(prev => prev.map(i =>
      i.status === "ready" ? { ...i, status: "converting" as const, progress: 20 } : i
    ));

    await Promise.allSettled(
      readyItems.map(async (item) => {
        try {
          // Determine output width: for "custom" use customW, otherwise scale is applied inside svgToPng via scale param
          const scaleMap: Record<string, number | undefined> = { "1x": undefined, "2x": undefined, "4x": undefined };
          // We pass outputWidth only for custom; for scale presets we set outputWidth = null and override the internal scale
          let outputWidth: number | undefined = undefined;
          if (scale === "custom") {
            outputWidth = customW;
          } else if (scale === "4x") {
            // We can't pass scale directly, so we'll compute: get natural size later. Simpler: pass a large outputWidth
            // For now: pass undefined and let svgToPng default to 2×, then user can use custom for exact control.
            // Better: encode scale into outputWidth via a sentinel approach. We'll just use custom for 4x.
            outputWidth = undefined; // will render at 2× (default)
          }
          // For 1x and 4x we need to know the natural SVG size. We handle this differently:
          // Instead of patching the function, we read the SVG viewBox here.
          if (scale !== "custom") {
            const text = await item.file.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, "image/svg+xml");
            const svgEl = doc.querySelector("svg");
            let natW = parseFloat(svgEl?.getAttribute("width") ?? "0");
            const vb = svgEl?.getAttribute("viewBox");
            if (!natW && vb) {
              const parts = vb.split(/[\s,]+/);
              natW = parseFloat(parts[2]) || 512;
            }
            if (!natW) natW = 512;
            const multiplier = scale === "1x" ? 1 : scale === "4x" ? 4 : 2;
            outputWidth = Math.round(natW * multiplier);
          }

          const result = await svgToPng(item.file, outputWidth);
          setItems(prev => prev.map(i =>
            i.id === item.id
              ? { ...i, status: "done" as const, resultBlob: result.blob, resultName: result.fileName }
              : i
          ));
        } catch {
          setItems(prev => prev.map(i =>
            i.id === item.id ? { ...i, status: "error" as const, errorMessage: "Conversion failed" } : i
          ));
        }
      })
    );

    setConverting(false);
    setAllDone(true);
  };

  const readyCount = items.filter(i => i.status === "ready").length;
  const doneItems  = items.filter(i => i.status === "done");

  return (
    <div className="w-full space-y-5">
      {!allDone && (
        <DropZone
          onFilesAdded={addFiles}
          acceptedTypes={ACCEPTED}
          maxSizeMB={10}
          maxFiles={20}
          currentCount={items.length}
          disabled={converting}
        />
      )}

      {/* Scale selector */}
      {!allDone && items.length > 0 && (
        <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/60 shadow-sm">
          <div className="flex items-center justify-between px-5 py-3 bg-slate-900 dark:bg-slate-950">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-400" />
              <span className="text-sm font-semibold text-white tracking-wide">Output Resolution</span>
            </div>
          </div>
          <div className="px-5 py-4 bg-slate-50 dark:bg-slate-800/40 flex flex-wrap items-center gap-3">
            {(["1x", "2x", "4x", "custom"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setScale(s)}
                className={`px-3.5 py-1.5 rounded-xl text-sm font-semibold border transition-all ${
                  scale === s
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
                }`}
              >
                {s === "custom" ? "Custom width" : s}
              </button>
            ))}
            {scale === "custom" && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={64}
                  max={8192}
                  value={customW}
                  onChange={e => setCustomW(Number(e.target.value))}
                  className="w-24 px-3 py-1.5 rounded-xl border border-slate-200 text-sm text-slate-700
                             focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <span className="text-sm text-slate-400">px wide</span>
              </div>
            )}
          </div>
        </div>
      )}

      {!allDone && items.length > 0 && (
        <FileList items={items.filter(i => i.status !== "done")} onRemove={removeFile} />
      )}

      {!allDone && readyCount > 0 && (
        <button
          onClick={handleConvert}
          disabled={converting}
          className="w-full flex items-center justify-center gap-2.5
                     py-4 px-8 rounded-2xl font-semibold text-white text-base
                     bg-gradient-to-r from-slate-900 via-indigo-700 to-indigo-600
                     hover:from-slate-800 hover:via-indigo-600 hover:to-indigo-500
                     disabled:opacity-60 disabled:cursor-not-allowed
                     shadow-[0_4px_20px_rgba(79,70,229,0.4)]
                     hover:shadow-[0_6px_28px_rgba(79,70,229,0.5)]
                     hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
        >
          {converting
            ? <><Loader2 className="w-5 h-5 animate-spin" /> Converting…</>
            : <><Wand2 className="w-5 h-5" /> Convert {readyCount} SVG{readyCount !== 1 ? "s" : ""} to PNG</>
          }
        </button>
      )}

      {doneItems.length > 0 && (
        <ResultsPanel items={doneItems} onReset={() => { setItems([]); setAllDone(false); }} />
      )}
    </div>
  );
}

"use client";

import { useState, useCallback, useId } from "react";
import { Loader2, Stamp } from "lucide-react";
import DropZone from "@/components/tools/shared/DropZone";
import FileList, { type FileItem } from "@/components/tools/shared/FileList";
import ResultsPanel from "@/components/tools/shared/ResultsPanel";
import {
  addWatermark,
  type WatermarkPosition,
  type ImageOutputFormat,
} from "@/lib/converters/imageConverter";

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

const POSITIONS: { label: string; value: WatermarkPosition }[] = [
  { label: "↖ Top Left",      value: "top-left"      },
  { label: "↑ Top Center",    value: "top-center"    },
  { label: "↗ Top Right",     value: "top-right"     },
  { label: "← Mid Left",      value: "middle-left"   },
  { label: "✦ Center",        value: "center"        },
  { label: "→ Mid Right",     value: "middle-right"  },
  { label: "↙ Bottom Left",   value: "bottom-left"   },
  { label: "↓ Bottom Center", value: "bottom-center" },
  { label: "↘ Bottom Right",  value: "bottom-right"  },
];

const OUTPUT_FORMATS: { label: string; value: ImageOutputFormat }[] = [
  { label: "JPG",  value: "image/jpeg" },
  { label: "PNG",  value: "image/png"  },
  { label: "WebP", value: "image/webp" },
];

export default function ImageWatermark() {
  const uid = useId();
  const [items, setItems]         = useState<FileItem[]>([]);
  const [converting, setConverting] = useState(false);
  const [allDone, setAllDone]     = useState(false);

  // Watermark settings
  const [text, setText]           = useState("© My Brand");
  const [fontSize, setFontSize]   = useState(4);        // % of image width
  const [color, setColor]         = useState("#ffffff");
  const [opacity, setOpacity]     = useState(0.6);
  const [position, setPosition]   = useState<WatermarkPosition>("bottom-right");
  const [tile, setTile]           = useState(false);
  const [outputFmt, setOutputFmt] = useState<ImageOutputFormat>("image/jpeg");

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

  const handleApply = async () => {
    const readyItems = items.filter(i => i.status === "ready");
    if (!readyItems.length || !text.trim()) return;
    setConverting(true);
    setItems(prev => prev.map(i =>
      i.status === "ready" ? { ...i, status: "converting" as const, progress: 20 } : i
    ));

    await Promise.allSettled(
      readyItems.map(async (item) => {
        try {
          const result = await addWatermark(
            item.file,
            { text: text.trim(), fontSize, color, opacity, position, tile },
            outputFmt,
            0.92
          );
          setItems(prev => prev.map(i =>
            i.id === item.id
              ? { ...i, status: "done" as const, resultBlob: result.blob, resultName: result.fileName }
              : i
          ));
        } catch {
          setItems(prev => prev.map(i =>
            i.id === item.id ? { ...i, status: "error" as const, errorMessage: "Failed to add watermark" } : i
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
          maxSizeMB={50}
          maxFiles={20}
          currentCount={items.length}
          disabled={converting}
        />
      )}

      {/* Settings panel */}
      {!allDone && items.length > 0 && (
        <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
          {/* Dark header */}
          <div className="px-5 py-3 bg-slate-900 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-400" />
            <span className="text-sm font-semibold text-white tracking-wide">Watermark Settings</span>
          </div>

          <div className="px-5 py-4 bg-white space-y-5">
            {/* Watermark text */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Watermark Text
              </label>
              <input
                type="text"
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="© Your Brand"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Font size + opacity row */}
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Font Size</label>
                  <span className="text-xs font-mono font-semibold text-indigo-600">{fontSize}%</span>
                </div>
                <input
                  type="range" min={1} max={15} step={0.5} value={fontSize}
                  onChange={e => setFontSize(Number(e.target.value))}
                  className="w-full accent-indigo-500 h-2 rounded-full cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Tiny</span><span>Large</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Opacity</label>
                  <span className="text-xs font-mono font-semibold text-indigo-600">{Math.round(opacity * 100)}%</span>
                </div>
                <input
                  type="range" min={0.05} max={1} step={0.05} value={opacity}
                  onChange={e => setOpacity(Number(e.target.value))}
                  className="w-full accent-indigo-500 h-2 rounded-full cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Subtle</span><span>Solid</span>
                </div>
              </div>
            </div>

            {/* Color + output format */}
            <div className="flex flex-wrap items-center gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color" value={color}
                    onChange={e => setColor(e.target.value)}
                    className="w-10 h-10 rounded-xl border-2 border-slate-200 cursor-pointer p-0.5 bg-white"
                  />
                  <span className="text-sm font-mono text-slate-600">{color.toUpperCase()}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Output Format</label>
                <div className="flex rounded-xl overflow-hidden border border-slate-200 divide-x divide-slate-200">
                  {OUTPUT_FORMATS.map(f => (
                    <button key={f.value} onClick={() => setOutputFmt(f.value)}
                      className={`px-3 py-2 text-xs font-semibold transition-all ${
                        outputFmt === f.value ? "bg-slate-900 text-white" : "bg-white text-slate-500 hover:bg-slate-50"
                      }`}>
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Mode</label>
                <div className="flex rounded-xl overflow-hidden border border-slate-200 divide-x divide-slate-200">
                  {[{ label: "Position", val: false }, { label: "Tile All", val: true }].map(m => (
                    <button key={String(m.val)} onClick={() => setTile(m.val)}
                      className={`px-3 py-2 text-xs font-semibold transition-all ${
                        tile === m.val ? "bg-slate-900 text-white" : "bg-white text-slate-500 hover:bg-slate-50"
                      }`}>
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Position grid */}
            {!tile && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Position</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {POSITIONS.map(p => (
                    <button key={p.value} onClick={() => setPosition(p.value)}
                      className={`py-2 rounded-xl text-xs font-medium transition-all ${
                        position === p.value
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-50 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200"
                      }`}>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* File list */}
      {!allDone && items.length > 0 && (
        <FileList items={items.filter(i => i.status !== "done")} onRemove={removeFile} />
      )}

      {/* Apply button */}
      {!allDone && readyCount > 0 && (
        <button
          onClick={handleApply}
          disabled={converting || !text.trim()}
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
            ? <><Loader2 className="w-5 h-5 animate-spin" /> Applying Watermark…</>
            : <><Stamp className="w-5 h-5" /> Apply Watermark to {readyCount} image{readyCount !== 1 ? "s" : ""}</>
          }
        </button>
      )}

      {doneItems.length > 0 && (
        <ResultsPanel items={doneItems} onReset={() => { setItems([]); setAllDone(false); }} />
      )}
    </div>
  );
}

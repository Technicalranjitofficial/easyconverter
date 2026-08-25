"use client";

import { useState, useCallback, useId, useEffect, useRef } from "react";
import { Loader2, Hash, Download, RotateCcw, FileText } from "lucide-react";
import PdfDropZone from "./PdfDropZone";
import PdfPagePreview from "./PdfPagePreview";
import { addPageNumbers, getPdfInfo, type PageNumberPosition, type PdfPageThumb } from "@/lib/converters/pdfConverter";
import { formatBytes } from "@/lib/utils/fileUtils";
import { triggerDownload } from "@/lib/utils/downloadUtils";

const POSITIONS: { value: PageNumberPosition; label: string }[] = [
  { value: "bottom-center", label: "↓ Bottom Center" },
  { value: "bottom-right",  label: "↘ Bottom Right"  },
  { value: "bottom-left",   label: "↙ Bottom Left"   },
  { value: "top-center",    label: "↑ Top Center"     },
  { value: "top-right",     label: "↗ Top Right"      },
  { value: "top-left",      label: "↖ Top Left"       },
];

// Live preview of page number position on a thumbnail
function PageNumberPreviewCanvas({
  thumb, position, fontSize, startNum, prefix, showTotal, totalPages,
}: {
  thumb: PdfPageThumb; position: PageNumberPosition; fontSize: number;
  startNum: number; prefix: string; showTotal: boolean; totalPages: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !thumb) return;
    const img = new Image();
    img.onload = () => {
      canvas.width  = thumb.width;
      canvas.height = thumb.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);

      // Scale fontSize to canvas
      const fsPx = Math.max(6, Math.round((fontSize / 11) * (canvas.width * 0.06)));
      const suffix = showTotal ? ` of ${totalPages}` : "";
      const label  = `${prefix}${startNum}${suffix}`;
      const margin = Math.round(canvas.width * 0.04);

      ctx.font = `${fsPx}px Arial, sans-serif`;
      ctx.fillStyle = "rgba(40,40,40,0.85)";
      ctx.textBaseline = "middle";
      const tw = ctx.measureText(label).width;

      let x = 0, y = 0;
      if (position.includes("left"))   x = margin;
      else if (position.includes("right")) x = canvas.width - tw - margin;
      else x = (canvas.width - tw) / 2;

      if (position.includes("top"))    y = margin + fsPx / 2;
      else                              y = canvas.height - margin - fsPx / 2;

      // White pill background
      const pad = fsPx * 0.4;
      ctx.fillStyle = "rgba(255,255,255,0.92)";
      ctx.beginPath();
      ctx.roundRect(x - pad, y - fsPx * 0.6, tw + pad * 2, fsPx * 1.2, 3);
      ctx.fill();

      ctx.fillStyle = "rgba(40,40,40,0.9)";
      ctx.fillText(label, x, y);
    };
    img.src = thumb.dataUrl;
  }, [thumb, position, fontSize, startNum, prefix, showTotal, totalPages]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "auto", borderRadius: 8, display: "block" }}
    />
  );
}

export default function PdfPageNumbers() {
  const uid = useId();
  const [items, setItems]       = useState<{ id: string; file: File; status: string; blob?: Blob; size?: number }[]>([]);
  const [firstThumbs, setFirstThumbs] = useState<{ [id: string]: PdfPageThumb }>({});
  const [pageCounts, setPageCounts]   = useState<{ [id: string]: number }>({});
  const [position, setPosition] = useState<PageNumberPosition>("bottom-center");
  const [fontSize, setFontSize] = useState(11);
  const [startNum, setStartNum] = useState(1);
  const [prefix, setPrefix]     = useState("");
  const [showTotal, setShowTotal] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [allDone, setAllDone]   = useState(false);

  const addFiles = useCallback((files: File[]) => {
    setItems(prev => [...prev, ...files.map(f => ({ id: `${uid}-${f.name}-${Date.now()}`, file: f, status: "ready" }))]);
    setAllDone(false);
  }, [uid]);

  const remove = (id: string) => setItems(prev => prev.filter(i => i.id !== id));

  const handleApply = async () => {
    const ready = items.filter(i => i.status === "ready");
    if (!ready.length) return;
    setLoading(true);
    setItems(prev => prev.map(i => i.status === "ready" ? { ...i, status: "processing" } : i));

    await Promise.allSettled(ready.map(async item => {
      try {
        const info = await getPdfInfo(item.file);
        const r = await addPageNumbers(item.file, {
          position, fontSize, startNumber: startNum,
          prefix: prefix || undefined,
          suffix: showTotal ? ` of ${info.pageCount}` : undefined,
        });
        setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: "done", blob: r.blob, size: r.resultSize } : i));
      } catch {
        setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: "error" } : i));
      }
    }));
    setLoading(false);
    setAllDone(true);
  };

  const doneItems  = items.filter(i => i.status === "done");
  const readyCount = items.filter(i => i.status === "ready").length;

  const previewItem  = items.find(i => i.status === "ready");
  const previewId    = previewItem?.id ?? "";
  const previewThumb = firstThumbs[previewId];
  const previewPages = pageCounts[previewId] ?? 0;

  const previewLabel = `${prefix}${startNum}${showTotal ? ` of ${previewPages || "N"}` : ""}`;

  return (
    <div className="w-full space-y-5">
      {!allDone && <PdfDropZone onFilesAdded={addFiles} disabled={loading} />}

      {!allDone && items.length > 0 && (
        <div className="space-y-4">
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
            <div className="px-4 py-2.5 bg-slate-900 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">Page Number Settings</span>
              </div>
              <span className="text-xs font-mono text-indigo-300">Preview: {previewLabel}</span>
            </div>

            <div className={`${previewThumb ? "grid grid-cols-1 lg:grid-cols-[1fr_180px]" : ""} bg-white`}>
              {/* Controls */}
              <div className="p-4 space-y-4">
                {/* Position grid */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 block mb-2">Position</label>
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

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Font Size</label>
                    <input type="number" min={6} max={24} value={fontSize} onChange={e => setFontSize(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Start #</label>
                    <input type="number" min={0} value={startNum} onChange={e => setStartNum(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Prefix</label>
                    <input type="text" value={prefix} onChange={e => setPrefix(e.target.value)} placeholder='e.g. "Page "'
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" checked={showTotal} onChange={e => setShowTotal(e.target.checked)} className="accent-indigo-600 w-4 h-4 rounded" />
                  <span className="text-sm text-slate-600">Show total pages (e.g. "1 of 10")</span>
                </label>
              </div>

              {/* Live preview */}
              {previewThumb && (
                <div className="p-4 border-t lg:border-t-0 lg:border-l border-slate-100 bg-slate-50 flex flex-col items-center gap-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Live Preview</p>
                  <div className="rounded-lg overflow-hidden border border-slate-200 shadow-sm w-full max-w-[160px]">
                    <PageNumberPreviewCanvas
                      thumb={previewThumb} position={position} fontSize={fontSize}
                      startNum={startNum} prefix={prefix} showTotal={showTotal}
                      totalPages={previewPages}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">Page 1 preview</p>
                </div>
              )}
            </div>

            {/* File list */}
            <div className="divide-y divide-slate-100 border-t border-slate-100">
              {items.filter(i => i.status !== "done").map(item => (
                <div key={item.id} className="flex items-center gap-3 px-4 py-3 bg-white">
                  <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                    {item.status === "processing"
                      ? <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
                      : <FileText className="w-4 h-4 text-red-500" />}
                  </div>
                  <p className="text-sm text-slate-700 flex-1 truncate">{item.file.name}</p>
                  {item.status === "ready" && (
                    <button onClick={() => remove(item.id)} className="text-slate-300 hover:text-red-400 p-1 transition-colors">✕</button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Hidden thumbnail loader for preview */}
          {previewItem?.file && (
            <div className="hidden">
              <PdfPagePreview
                file={previewItem.file}
                selectionMode="none"
                showLabel={false}
                onLoaded={t => {
                  if (t[0]) {
                    setFirstThumbs(prev => ({ ...prev, [previewId]: t[0] }));
                    setPageCounts(prev => ({ ...prev, [previewId]: t.length }));
                  }
                }}
              />
            </div>
          )}

          {readyCount > 0 && (
            <button onClick={handleApply} disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-semibold text-white
                         bg-gradient-to-r from-slate-900 via-indigo-700 to-indigo-600
                         hover:from-slate-800 hover:via-indigo-600 hover:to-indigo-500
                         disabled:opacity-60 shadow-[0_4px_20px_rgba(79,70,229,0.4)]
                         hover:-translate-y-0.5 transition-all duration-200">
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" />Adding Numbers…</> : <><Hash className="w-5 h-5" />Add Page Numbers to {readyCount} PDF{readyCount !== 1 ? "s" : ""}</>}
            </button>
          )}
        </div>
      )}

      {doneItems.length > 0 && (
        <div className="space-y-2 animate-slide-up">
          {doneItems.map(item => (
            <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl border-l-[3px] border-l-emerald-500 border border-slate-100 bg-white shadow-sm">
              <FileText className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 truncate">{item.file.name}</p>
                <p className="text-xs text-slate-400">{formatBytes(item.size ?? 0)}</p>
              </div>
              <button onClick={() => triggerDownload(item.blob!, item.file.name.replace(".pdf", "-numbered.pdf"))}
                className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-700 transition-colors flex-shrink-0">
                <Download className="w-3.5 h-3.5 inline mr-1" />DL
              </button>
            </div>
          ))}
          <button onClick={() => { setItems([]); setAllDone(false); setFirstThumbs({}); setPageCounts({}); }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors mt-2">
            <RotateCcw className="w-4 h-4" />Add Numbers to More PDFs
          </button>
        </div>
      )}
    </div>
  );
}

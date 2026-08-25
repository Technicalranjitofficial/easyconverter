"use client";

import { useState, useCallback, useId, useMemo } from "react";
import { Loader2, Hash, Download, RotateCcw, FileText } from "lucide-react";
import PdfDropZone from "./PdfDropZone";
import PdfPagePreview, { type PdfPageConfig } from "./PdfPagePreview";
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

export default function PdfPageNumbers() {
  const uid = useId();
  const [items, setItems]       = useState<{ id: string; file: File; status: string; blob?: Blob; size?: number; thumbs: PdfPageThumb[] }[]>([]);
  const [position, setPosition] = useState<PageNumberPosition>("bottom-center");
  const [fontSize, setFontSize] = useState(11);
  const [startNum, setStartNum] = useState(1);
  const [prefix, setPrefix]     = useState("");
  const [showTotal, setShowTotal] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [allDone, setAllDone]   = useState(false);

  const addFiles = useCallback((files: File[]) => {
    setItems(prev => [...prev, ...files.map(f => ({ id: `${uid}-${f.name}-${Date.now()}`, file: f, status: "ready", thumbs: [] }))]);
    setAllDone(false);
  }, [uid]);

  const remove = (id: string) => setItems(prev => prev.filter(i => i.id !== id));

  const firstItem = items.find(i => i.status === "ready");

  // Page configs: every page shows its actual number in the chosen position
  const pageConfigs = useMemo<PdfPageConfig[]>(() => {
    if (!firstItem?.thumbs.length) return [];
    const total = firstItem.thumbs.length;
    const suffix = showTotal ? ` of ${total}` : "";
    return firstItem.thumbs.map((t, idx) => ({
      pageNumber: t.pageNumber,
      overlay: {
        type: "pageNumber" as const,
        label: `${prefix}${startNum + idx}${suffix}`,
        position,
      },
    }));
  }, [firstItem, position, fontSize, startNum, prefix, showTotal]);

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

  return (
    <div className="w-full space-y-5">
      {!allDone && <PdfDropZone onFilesAdded={addFiles} disabled={loading} />}

      {!allDone && items.length > 0 && (
        <div className="space-y-4">
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
            <div className="px-4 py-2.5 bg-slate-900 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">Page Number Settings</span>
              <span className="ml-auto text-xs text-indigo-300">Numbers shown on pages below ↓</span>
            </div>
            <div className="p-4 bg-white space-y-4">
              {/* Position grid */}
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 block mb-2">Position</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {POSITIONS.map(p => (
                    <button key={p.value} onClick={() => setPosition(p.value)}
                      className={`py-2 rounded-xl text-xs font-medium transition-all ${
                        position === p.value ? "bg-indigo-600 text-white" : "bg-slate-50 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200"
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
                  <input type="text" value={prefix} onChange={e => setPrefix(e.target.value)} placeholder='"Page "'
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={showTotal} onChange={e => setShowTotal(e.target.checked)} className="accent-indigo-600 w-4 h-4 rounded" />
                <span className="text-sm text-slate-600">Show total pages (e.g. "1 of 10")</span>
              </label>
            </div>
          </div>

          {/* Live page number preview — every thumbnail shows its actual number */}
          {firstItem && (
            <PdfPagePreview
              file={firstItem.file}
              pageConfigs={pageConfigs}
              selectionMode="none"
              showLabel
              onLoaded={t => setItems(prev => prev.map(i => i.id === firstItem.id ? { ...i, thumbs: t } : i))}
            />
          )}

          {/* File list */}
          <div className="space-y-2">
            {items.filter(i => i.status !== "done").map(item => (
              <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white">
                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                  {item.status === "processing" ? <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" /> : <FileText className="w-4 h-4 text-red-500" />}
                </div>
                <p className="text-sm text-slate-700 flex-1 truncate">{item.file.name}</p>
                {item.status === "ready" && (
                  <button onClick={() => remove(item.id)} className="text-slate-300 hover:text-red-400 p-1 transition-colors">✕</button>
                )}
              </div>
            ))}
          </div>

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
          <button onClick={() => { setItems([]); setAllDone(false); }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors mt-2">
            <RotateCcw className="w-4 h-4" />Number More PDFs
          </button>
        </div>
      )}
    </div>
  );
}

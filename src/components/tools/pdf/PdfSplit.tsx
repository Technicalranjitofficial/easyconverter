"use client";

import { useState, useCallback, useMemo } from "react";
import { Loader2, Scissors, Download, RotateCcw, FileText } from "lucide-react";
import PdfDropZone from "./PdfDropZone";
import PdfPagePreview, { type PdfPageConfig } from "./PdfPagePreview";
import { splitPdf, type SplitMode } from "@/lib/converters/pdfConverter";
import { formatBytes } from "@/lib/utils/fileUtils";
import { triggerDownload } from "@/lib/utils/downloadUtils";
import type { PdfPageThumb } from "@/lib/converters/pdfConverter";

type SplitTab = "all" | "range" | "select";

export default function PdfSplit() {
  const [file, setFile]         = useState<File | null>(null);
  const [thumbs, setThumbs]     = useState<PdfPageThumb[]>([]);
  const [tab, setTab]           = useState<SplitTab>("all");
  const [rangeFrom, setFrom]    = useState(1);
  const [rangeTo, setTo]        = useState(1);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [loading, setLoading]   = useState(false);
  const [results, setResults]   = useState<{ blob: Blob; fileName: string }[] | null>(null);

  const handleFile = useCallback((files: File[]) => {
    const f = files[0]; if (!f) return;
    setFile(f); setResults(null); setSelected(new Set()); setThumbs([]);
  }, []);

  // ── Reactive pageConfigs — update on every action ────────────────────────
  const pageConfigs = useMemo<PdfPageConfig[]>(() => {
    if (!thumbs.length) return [];

    return thumbs.map(t => {
      let willExtract = false;

      if (tab === "all") {
        willExtract = true;
      } else if (tab === "range") {
        willExtract = t.pageNumber >= rangeFrom && t.pageNumber <= rangeTo;
      } else if (tab === "select") {
        willExtract = selected.has(t.pageNumber);
      }

      return {
        pageNumber: t.pageNumber,
        overlay: willExtract
          ? { type: "selected" as const }
          : { type: "excluded" as const },
      };
    });
  }, [thumbs, tab, rangeFrom, rangeTo, selected]);

  const handleSplit = async () => {
    if (!file) return;
    setLoading(true);
    try {
      let mode: SplitMode = "all";
      let pages: number[] | undefined;
      let range: { from: number; to: number } | undefined;
      if (tab === "range")  { mode = "range"; range = { from: rangeFrom, to: rangeTo }; }
      if (tab === "select") { mode = "pages"; pages = Array.from(selected).sort((a, b) => a - b); }
      const r = await splitPdf(file, { mode, range, pages });
      setResults(r.blobs);
    } catch { alert("Split failed."); }
    finally { setLoading(false); }
  };

  const downloadAll = async () => {
    if (!results) return;
    if (results.length === 1) { triggerDownload(results[0].blob, results[0].fileName); return; }
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();
    results.forEach(r => zip.file(r.fileName, r.blob));
    triggerDownload(await zip.generateAsync({ type: "blob" }), "split-pages.zip");
  };

  const reset = () => { setFile(null); setThumbs([]); setResults(null); setSelected(new Set()); };

  const extractCount = tab === "all" ? thumbs.length
    : tab === "range" ? Math.max(0, rangeTo - rangeFrom + 1)
    : selected.size;

  const TABS: { value: SplitTab; label: string; desc: string }[] = [
    { value: "all",    label: "All Pages",    desc: "Each page → separate PDF" },
    { value: "range",  label: "Page Range",   desc: "Extract pages 1–5, etc." },
    { value: "select", label: "Pick Pages",   desc: "Click pages to select" },
  ];

  return (
    <div className="w-full space-y-5">
      {!file && <PdfDropZone onFilesAdded={handleFile} multiple={false} />}

      {file && !results && (
        <>
          <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white">
            <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
              <FileText className="w-4 h-4 text-red-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700 truncate">{file.name}</p>
              <p className="text-xs text-slate-400">{formatBytes(file.size)}{thumbs.length > 0 ? ` · ${thumbs.length} pages` : ""}</p>
            </div>
          </div>

          {/* Reactive preview — greens the pages that will be extracted */}
          <PdfPagePreview
            file={file}
            pageConfigs={pageConfigs}
            selectionMode={tab === "select" ? "checkbox" : "none"}
            selectedPages={selected}
            onSelectionChange={pages => {
              setSelected(pages);
              setTab("select");
            }}
            showLabel
            onLoaded={t => { setThumbs(t); setTo(t.length); }}
          />

          {thumbs.length > 0 && (
            <>
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                <div className="px-4 py-2.5 bg-slate-900 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">Split Mode</span>
                  {extractCount > 0 && (
                    <span className="ml-auto text-xs font-semibold text-emerald-400">
                      {extractCount} page{extractCount !== 1 ? "s" : ""} highlighted ↑
                    </span>
                  )}
                </div>
                <div className="p-4 bg-white space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    {TABS.map(t => (
                      <button key={t.value} onClick={() => setTab(t.value)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          tab === t.value ? "border-indigo-400 bg-indigo-50" : "border-slate-200 hover:border-slate-300"
                        }`}>
                        <p className={`text-xs font-bold mb-0.5 ${tab === t.value ? "text-indigo-700" : "text-slate-700"}`}>{t.label}</p>
                        <p className="text-[11px] text-slate-400 leading-tight">{t.desc}</p>
                      </button>
                    ))}
                  </div>
                  {tab === "range" && (
                    <div className="flex items-center gap-3 pt-1">
                      <label className="text-xs font-semibold text-slate-500">From</label>
                      <input type="number" min={1} max={thumbs.length} value={rangeFrom}
                        onChange={e => setFrom(Math.max(1, Math.min(thumbs.length, Number(e.target.value))))}
                        className="w-20 px-3 py-2 rounded-xl border border-slate-200 text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                      <label className="text-xs font-semibold text-slate-500">To</label>
                      <input type="number" min={1} max={thumbs.length} value={rangeTo}
                        onChange={e => setTo(Math.max(1, Math.min(thumbs.length, Number(e.target.value))))}
                        className="w-20 px-3 py-2 rounded-xl border border-slate-200 text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                      <span className="text-xs text-slate-400">of {thumbs.length}</span>
                    </div>
                  )}
                  {tab === "select" && (
                    <p className="text-xs text-slate-400">
                      {selected.size > 0 ? `${selected.size} page${selected.size !== 1 ? "s" : ""} selected.` : "Click pages in the preview above to select them."}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={handleSplit}
                disabled={loading || extractCount === 0}
                className="w-full flex items-center justify-center gap-2.5
                           py-4 rounded-2xl font-semibold text-white text-base
                           bg-gradient-to-r from-slate-900 via-indigo-700 to-indigo-600
                           hover:from-slate-800 hover:via-indigo-600 hover:to-indigo-500
                           disabled:opacity-60 shadow-[0_4px_20px_rgba(79,70,229,0.4)]
                           hover:-translate-y-0.5 transition-all duration-200">
                {loading
                  ? <><Loader2 className="w-5 h-5 animate-spin" />Splitting…</>
                  : <><Scissors className="w-5 h-5" />
                      Extract {extractCount > 0 ? `${extractCount} page${extractCount !== 1 ? "s" : ""}` : ""}
                    </>
                }
              </button>
            </>
          )}
        </>
      )}

      {results && (
        <div className="rounded-2xl overflow-hidden border border-emerald-200 shadow-sm animate-slide-up">
          <div className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-900">
            <Scissors className="w-4 h-4 text-emerald-400" />
            <p className="text-sm font-semibold text-white">{results.length} file{results.length !== 1 ? "s" : ""} ready</p>
          </div>
          <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto">
            {results.map((r, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-2.5 bg-white hover:bg-slate-50">
                <FileText className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span className="text-sm text-slate-600 flex-1 truncate">{r.fileName}</span>
                <button onClick={() => triggerDownload(r.blob, r.fileName)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-700 transition-colors flex-shrink-0">
                  <Download className="w-3.5 h-3.5 inline mr-1" />DL
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-3 p-4 bg-emerald-50 border-t border-emerald-100">
            <button onClick={downloadAll}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white text-sm
                         bg-gradient-to-r from-slate-900 via-indigo-700 to-indigo-600 hover:-translate-y-0.5 transition-all">
              <Download className="w-4 h-4" />{results.length === 1 ? "Download PDF" : "Download All as ZIP"}
            </button>
            <button onClick={reset}
              className="flex items-center gap-2 py-3 px-5 rounded-xl text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-all">
              <RotateCcw className="w-4 h-4" />Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

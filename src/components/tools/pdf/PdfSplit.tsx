"use client";

import { useState, useCallback } from "react";
import { Loader2, Scissors, Download, RotateCcw, FileText } from "lucide-react";
import PdfDropZone from "./PdfDropZone";
import { splitPdf, getPdfInfo, type SplitMode } from "@/lib/converters/pdfConverter";
import { formatBytes } from "@/lib/utils/fileUtils";
import { triggerDownload } from "@/lib/utils/downloadUtils";

export default function PdfSplit() {
  const [file, setFile]     = useState<File | null>(null);
  const [info, setInfo]     = useState<{ pageCount: number; size: number } | null>(null);
  const [mode, setMode]     = useState<SplitMode>("all");
  const [rangeFrom, setFrom] = useState(1);
  const [rangeTo, setTo]     = useState(1);
  const [pagesInput, setPages] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ blob: Blob; fileName: string }[] | null>(null);

  const handleFile = useCallback(async (files: File[]) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setResults(null);
    const i = await getPdfInfo(f);
    setInfo({ pageCount: i.pageCount, size: f.size });
    setTo(i.pageCount);
  }, []);

  const handleSplit = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const parsedPages = pagesInput.split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      const r = await splitPdf(file, {
        mode,
        range: mode === "range" ? { from: rangeFrom, to: rangeTo } : undefined,
        pages: mode === "pages" ? parsedPages : undefined,
      });
      setResults(r.blobs);
    } catch { alert("Failed to split PDF."); }
    finally { setLoading(false); }
  };

  const downloadAll = async () => {
    if (!results) return;
    if (results.length === 1) { triggerDownload(results[0].blob, results[0].fileName); return; }
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();
    results.forEach(r => zip.file(r.fileName, r.blob));
    const zipBlob = await zip.generateAsync({ type: "blob" });
    triggerDownload(zipBlob, "split-pages.zip");
  };

  const reset = () => { setFile(null); setInfo(null); setResults(null); };

  const MODES: { value: SplitMode; label: string; desc: string }[] = [
    { value: "all",   label: "Every Page",   desc: "Each page becomes a separate PDF" },
    { value: "range", label: "Page Range",   desc: "Extract a range of pages" },
    { value: "pages", label: "Select Pages", desc: "Extract specific pages" },
  ];

  return (
    <div className="w-full space-y-5">
      {!file && <PdfDropZone onFilesAdded={handleFile} multiple={false} />}

      {file && info && !results && (
        <>
          {/* File info */}
          <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-white">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-red-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700 truncate">{file.name}</p>
              <p className="text-xs text-slate-400">{info.pageCount} pages · {formatBytes(info.size)}</p>
            </div>
          </div>

          {/* Mode selector */}
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
            <div className="px-4 py-2.5 bg-slate-900 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">Split Mode</span>
            </div>
            <div className="p-4 bg-white space-y-3">
              {MODES.map(m => (
                <label key={m.value} className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer border transition-all ${
                  mode === m.value ? "border-indigo-300 bg-indigo-50" : "border-slate-100 hover:border-slate-200"
                }`}>
                  <input type="radio" name="mode" value={m.value} checked={mode === m.value}
                    onChange={() => setMode(m.value)} className="mt-0.5 accent-indigo-600" />
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{m.label}</p>
                    <p className="text-xs text-slate-400">{m.desc}</p>
                  </div>
                </label>
              ))}

              {mode === "range" && (
                <div className="flex items-center gap-3 pt-1">
                  <label className="text-xs font-semibold text-slate-500">From page</label>
                  <input type="number" min={1} max={info.pageCount} value={rangeFrom}
                    onChange={e => setFrom(Number(e.target.value))}
                    className="w-20 px-3 py-2 rounded-xl border border-slate-200 text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  <label className="text-xs font-semibold text-slate-500">To page</label>
                  <input type="number" min={1} max={info.pageCount} value={rangeTo}
                    onChange={e => setTo(Number(e.target.value))}
                    className="w-20 px-3 py-2 rounded-xl border border-slate-200 text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  <span className="text-xs text-slate-400">of {info.pageCount}</span>
                </div>
              )}

              {mode === "pages" && (
                <div className="space-y-1.5 pt-1">
                  <label className="text-xs font-semibold text-slate-500">Page numbers (comma-separated)</label>
                  <input type="text" value={pagesInput} onChange={e => setPages(e.target.value)}
                    placeholder={`e.g. 1, 3, 5 (max page ${info.pageCount})`}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              )}
            </div>
          </div>

          <button onClick={handleSplit} disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-semibold text-white
                       bg-gradient-to-r from-slate-900 via-indigo-700 to-indigo-600
                       hover:from-slate-800 hover:via-indigo-600 hover:to-indigo-500
                       disabled:opacity-60 shadow-[0_4px_20px_rgba(79,70,229,0.4)]
                       hover:-translate-y-0.5 transition-all duration-200">
            {loading ? <><Loader2 className="w-5 h-5 animate-spin" />Splitting…</> : <><Scissors className="w-5 h-5" />Split PDF</>}
          </button>
        </>
      )}

      {results && (
        <div className="rounded-2xl overflow-hidden border border-emerald-200 shadow-sm animate-slide-up">
          <div className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-900">
            <Scissors className="w-4 h-4 text-emerald-400" />
            <p className="text-sm font-semibold text-white">Split complete — {results.length} file{results.length !== 1 ? "s" : ""}</p>
          </div>
          <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
            {results.map((r, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 bg-white hover:bg-slate-50">
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

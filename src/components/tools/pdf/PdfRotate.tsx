"use client";

import { useState, useCallback } from "react";
import { Loader2, RotateCw, RotateCcw, Download, RefreshCw, FileText } from "lucide-react";
import PdfDropZone from "./PdfDropZone";
import { rotatePdf, getPdfInfo, type RotationAngle, type RotatePageSelection } from "@/lib/converters/pdfConverter";
import { formatBytes } from "@/lib/utils/fileUtils";
import { triggerDownload } from "@/lib/utils/downloadUtils";

export default function PdfRotate() {
  const [file, setFile]     = useState<File | null>(null);
  const [info, setInfo]     = useState<{ pageCount: number } | null>(null);
  const [angle, setAngle]   = useState<RotationAngle>(90);
  const [selMode, setSelMode] = useState<"all" | "custom">("all");
  const [customPages, setCustomPages] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState<{ blob: Blob; size: number } | null>(null);

  const handleFile = useCallback(async (files: File[]) => {
    const f = files[0]; if (!f) return;
    setFile(f); setResult(null);
    const i = await getPdfInfo(f);
    setInfo({ pageCount: i.pageCount });
  }, []);

  const handleRotate = async () => {
    if (!file) return;
    setLoading(true);
    try {
      let selection: RotatePageSelection = "all";
      if (selMode === "custom") {
        selection = customPages.split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      }
      const r = await rotatePdf(file, angle, selection);
      setResult({ blob: r.blob, size: r.resultSize });
    } catch { alert("Failed to rotate PDF."); }
    finally { setLoading(false); }
  };

  const reset = () => { setFile(null); setInfo(null); setResult(null); };

  const ANGLES: { value: RotationAngle; label: string; icon: React.ReactNode }[] = [
    { value: 90,  label: "90° CW",  icon: <RotateCw className="w-4 h-4" /> },
    { value: 270, label: "90° CCW", icon: <RotateCcw className="w-4 h-4" /> },
    { value: 180, label: "180°",    icon: <RefreshCw className="w-4 h-4" /> },
  ];

  return (
    <div className="w-full space-y-5">
      {!file && <PdfDropZone onFilesAdded={handleFile} multiple={false} />}

      {file && info && !result && (
        <>
          <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-white">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-red-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700 truncate">{file.name}</p>
              <p className="text-xs text-slate-400">{info.pageCount} pages · {formatBytes(file.size)}</p>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
            <div className="px-4 py-2.5 bg-slate-900 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">Rotation Settings</span>
            </div>
            <div className="p-4 bg-white space-y-4">
              {/* Angle */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Rotation Angle</p>
                <div className="flex gap-2">
                  {ANGLES.map(a => (
                    <button key={a.value} onClick={() => setAngle(a.value)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                        angle === a.value ? "border-indigo-400 bg-indigo-600 text-white" : "border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}>
                      {a.icon}{a.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Page selection */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Pages to Rotate</p>
                <div className="flex gap-2 mb-3">
                  {(["all", "custom"] as const).map(m => (
                    <button key={m} onClick={() => setSelMode(m)}
                      className={`flex-1 py-2 rounded-xl border text-sm font-semibold transition-all ${
                        selMode === m ? "border-indigo-400 bg-indigo-50 text-indigo-700" : "border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}>
                      {m === "all" ? "All Pages" : "Specific Pages"}
                    </button>
                  ))}
                </div>
                {selMode === "custom" && (
                  <input type="text" value={customPages} onChange={e => setCustomPages(e.target.value)}
                    placeholder={`e.g. 1, 3, 5 (max ${info.pageCount})`}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                )}
              </div>
            </div>
          </div>

          <button onClick={handleRotate} disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-semibold text-white
                       bg-gradient-to-r from-slate-900 via-indigo-700 to-indigo-600
                       hover:from-slate-800 hover:via-indigo-600 hover:to-indigo-500
                       disabled:opacity-60 shadow-[0_4px_20px_rgba(79,70,229,0.4)]
                       hover:-translate-y-0.5 transition-all duration-200">
            {loading ? <><Loader2 className="w-5 h-5 animate-spin" />Rotating…</> : <><RotateCw className="w-5 h-5" />Rotate PDF</>}
          </button>
        </>
      )}

      {result && (
        <div className="rounded-2xl overflow-hidden border border-emerald-200 shadow-sm animate-slide-up">
          <div className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-900">
            <RotateCw className="w-4 h-4 text-emerald-400" />
            <p className="text-sm font-semibold text-white">Rotation complete</p>
            <span className="ml-auto text-xs text-slate-400">{formatBytes(result.size)}</span>
          </div>
          <div className="flex gap-3 p-4 bg-emerald-50">
            <button onClick={() => triggerDownload(result.blob, file!.name.replace(".pdf", "-rotated.pdf"))}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white text-sm
                         bg-gradient-to-r from-slate-900 via-indigo-700 to-indigo-600 hover:-translate-y-0.5 transition-all">
              <Download className="w-4 h-4" />Download Rotated PDF
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

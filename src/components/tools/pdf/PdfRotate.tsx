"use client";

import { useState, useCallback } from "react";
import { Loader2, RotateCw, RotateCcw, RefreshCw, Download, FileText } from "lucide-react";
import PdfDropZone from "./PdfDropZone";
import PdfPagePreview from "./PdfPagePreview";
import { rotatePdf, type RotationAngle } from "@/lib/converters/pdfConverter";
import { formatBytes } from "@/lib/utils/fileUtils";
import { triggerDownload } from "@/lib/utils/downloadUtils";
import type { PdfPageThumb } from "@/lib/converters/pdfConverter";

export default function PdfRotate() {
  const [file, setFile]       = useState<File | null>(null);
  const [thumbs, setThumbs]   = useState<PdfPageThumb[]>([]);
  const [angle, setAngle]     = useState<RotationAngle>(90);
  const [selMode, setSelMode] = useState<"all" | "select">("all");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState<{ blob: Blob; size: number } | null>(null);

  const handleFile = useCallback((files: File[]) => {
    const f = files[0]; if (!f) return;
    setFile(f); setResult(null); setSelected(new Set()); setThumbs([]);
  }, []);

  const handleRotate = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const selection = selMode === "all" ? "all" : Array.from(selected).sort((a, b) => a - b);
      const r = await rotatePdf(file, angle, selection);
      setResult({ blob: r.blob, size: r.resultSize });
    } catch { alert("Rotation failed."); }
    finally { setLoading(false); }
  };

  const reset = () => { setFile(null); setThumbs([]); setResult(null); setSelected(new Set()); };

  const ANGLES: { value: RotationAngle; label: string; icon: React.ReactNode }[] = [
    { value: 90,  label: "90° CW",  icon: <RotateCw className="w-4 h-4" /> },
    { value: 270, label: "90° CCW", icon: <RotateCcw className="w-4 h-4" /> },
    { value: 180, label: "180°",    icon: <RefreshCw className="w-4 h-4" /> },
  ];

  const rotateCount = selMode === "all" ? thumbs.length : selected.size;

  return (
    <div className="w-full space-y-5">
      {!file && <PdfDropZone onFilesAdded={handleFile} multiple={false} />}

      {file && !result && (
        <>
          {/* File badge */}
          <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white">
            <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
              <FileText className="w-4 h-4 text-red-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700 truncate">{file.name}</p>
              <p className="text-xs text-slate-400">{formatBytes(file.size)}{thumbs.length > 0 ? ` · ${thumbs.length} pages` : ""}</p>
            </div>
          </div>

          {/* Page thumbnail grid — always shown */}
          <PdfPagePreview
            file={file}
            selectionMode={selMode === "select" ? "checkbox" : "none"}
            selectedPages={selected}
            onSelectionChange={setSelected}
            showLabel
            onLoaded={t => setThumbs(t)}
          />

          {/* Settings */}
          {thumbs.length > 0 && (
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
              <div className="px-4 py-2.5 bg-slate-900 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">Rotation Settings</span>
              </div>
              <div className="p-4 bg-white space-y-4">
                {/* Angle buttons */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Angle</p>
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

                {/* Which pages */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Apply To</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { v: "all" as const, label: "All pages" },
                      { v: "select" as const, label: "Selected pages" },
                    ].map(m => (
                      <button key={m.v} onClick={() => setSelMode(m.v)}
                        className={`py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                          selMode === m.v ? "border-indigo-400 bg-indigo-50 text-indigo-700" : "border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}>
                        {m.label}
                      </button>
                    ))}
                  </div>
                  {selMode === "select" && (
                    <p className="text-xs text-slate-400 mt-2">
                      {selected.size > 0
                        ? `${selected.size} page${selected.size !== 1 ? "s" : ""} selected — click thumbnails above to change`
                        : "Click thumbnails above to select pages to rotate."}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {thumbs.length > 0 && (
            <button
              onClick={handleRotate}
              disabled={loading || rotateCount === 0}
              className="w-full flex items-center justify-center gap-2.5
                         py-4 rounded-2xl font-semibold text-white text-base
                         bg-gradient-to-r from-slate-900 via-indigo-700 to-indigo-600
                         hover:from-slate-800 hover:via-indigo-600 hover:to-indigo-500
                         disabled:opacity-60 disabled:cursor-not-allowed
                         shadow-[0_4px_20px_rgba(79,70,229,0.4)]
                         hover:-translate-y-0.5 transition-all duration-200"
            >
              {loading
                ? <><Loader2 className="w-5 h-5 animate-spin" />Rotating…</>
                : <><RotateCw className="w-5 h-5" />
                    Rotate {rotateCount > 0 ? `${rotateCount} page${rotateCount !== 1 ? "s" : ""} ` : ""}by {angle}°
                  </>
              }
            </button>
          )}
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

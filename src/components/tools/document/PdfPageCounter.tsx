"use client";
import { useState, useCallback } from "react";
import { FileText, Loader2 } from "lucide-react";
import { getPdfInfo } from "@/lib/converters/pdfConverter";
import { formatBytes } from "@/lib/utils/fileUtils";

export default function PdfPageCounter() {
  const [info, setInfo]     = useState<{ pageCount: number; fileSize: number; title?: string; author?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");
  const [fileName, setFileName] = useState("");

  const handleFile = useCallback(async (file: File) => {
    setLoading(true); setError(""); setInfo(null); setFileName(file.name);
    try {
      const i = await getPdfInfo(file);
      setInfo({ ...i, fileSize: file.size });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to read PDF.");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="w-full space-y-5">
      <label onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }} onDragOver={e => e.preventDefault()}
        className="flex flex-col items-center justify-center w-full min-h-[180px] rounded-2xl border-2
                   border-dashed border-slate-300 cursor-pointer bg-gradient-to-b from-slate-50 to-white
                   hover:border-red-400 hover:bg-red-50/20 transition-all">
        <input type="file" accept="application/pdf" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} className="sr-only" />
        <div className="flex flex-col items-center gap-3 p-6 pointer-events-none">
          <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center">
            <FileText className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-sm font-semibold text-slate-700">Drop PDF file here or click to browse</p>
          <p className="text-xs text-slate-400">.pdf · Max 100 MB</p>
        </div>
      </label>
      {loading && <div className="flex items-center justify-center py-6 gap-2 text-sm text-slate-500"><Loader2 className="w-5 h-5 animate-spin text-red-500" />Reading PDF…</div>}
      {error   && <p className="text-sm text-red-500">{error}</p>}
      {info && (
        <div className="animate-fade-in space-y-4">
          <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-white">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700 truncate">{fileName}</p>
              <p className="text-xs text-slate-400">{formatBytes(info.fileSize)}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Pages",  value: String(info.pageCount),           big: true  },
              { label: "Size",   value: formatBytes(info.fileSize),       big: false },
              { label: "Title",  value: info.title  || "—",              big: false },
              { label: "Author", value: info.author || "—",              big: false },
            ].map(s => (
              <div key={s.label} className={`flex flex-col items-center p-5 rounded-2xl bg-white border border-slate-100 shadow-sm ${s.big ? "border-red-200 bg-red-50" : ""}`}>
                <span className={`${s.big ? "text-5xl font-black text-red-700" : "text-lg font-bold text-slate-800"} tabular-nums truncate max-w-full`}>{s.value}</span>
                <span className={`text-xs mt-1 ${s.big ? "text-red-500" : "text-slate-400"}`}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

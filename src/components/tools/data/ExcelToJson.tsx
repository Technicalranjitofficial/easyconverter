"use client";
import { useState, useCallback } from "react";
import { Copy, Check, Download, FileSpreadsheet } from "lucide-react";

export default function ExcelToJson() {
  const [json, setJson]     = useState("");
  const [fileName, setFileName] = useState("");
  const [loading, setLoading]   = useState(false);
  const [copied, setCopied]     = useState(false);
  const [error, setError]       = useState("");

  const handleFile = useCallback(async (file: File) => {
    setLoading(true); setError(""); setJson("");
    try {
      const XLSX = (await import("xlsx")).default;
      const buf  = await file.arrayBuffer();
      const wb   = XLSX.read(buf, { type: "array" });
      const result: Record<string, unknown[]> = {};
      for (const sheetName of wb.SheetNames) {
        result[sheetName] = XLSX.utils.sheet_to_json(wb.Sheets[sheetName]);
      }
      setJson(JSON.stringify(Object.keys(result).length === 1 ? Object.values(result)[0] : result, null, 2));
      setFileName(file.name.replace(/\.[^.]+$/, ".json"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to parse Excel file.");
    } finally {
      setLoading(false);
    }
  }, []);

  const copy = async () => { await navigator.clipboard.writeText(json); setCopied(true); setTimeout(() => setCopied(false), 1800); };
  const download = () => {
    const blob = new Blob([json], { type: "application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = fileName || "data.json"; a.click();
  };

  return (
    <div className="w-full space-y-5">
      <label
        onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        onDragOver={e => e.preventDefault()}
        className="flex flex-col items-center justify-center w-full min-h-[180px] rounded-2xl border-2
                   border-dashed border-slate-300 cursor-pointer bg-gradient-to-b from-slate-50 to-white
                   hover:border-indigo-400 hover:bg-indigo-50/30 transition-all">
        <input type="file" accept=".xlsx,.xls,.csv" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} className="sr-only" />
        <div className="flex flex-col items-center gap-3 p-6 pointer-events-none">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
            <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
          </div>
          <p className="text-sm font-semibold text-slate-700">Drop Excel file here or click to browse</p>
          <p className="text-xs text-slate-400">.xlsx, .xls, .csv · No upload needed</p>
        </div>
      </label>
      {loading && <div className="text-center text-sm text-slate-500 py-4">Parsing Excel file…</div>}
      {error  && <p className="text-sm text-red-500">{error}</p>}
      {json && (
        <div className="space-y-3 animate-fade-in">
          <div className="flex gap-2">
            <button onClick={copy} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-700 transition-colors">
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}{copied ? "Copied!" : "Copy JSON"}
            </button>
            <button onClick={download} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-colors">
              <Download className="w-3.5 h-3.5" />Download JSON
            </button>
          </div>
          <textarea readOnly rows={14} value={json}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-mono text-slate-700 bg-slate-50 resize-none focus:outline-none" />
        </div>
      )}
    </div>
  );
}

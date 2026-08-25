"use client";
import { useState } from "react";
import { jsonToTable } from "@/lib/converters/dataConverter";
import { Wand2, Copy, Check, Download } from "lucide-react";

const SAMPLE = '[{"name":"Alice","age":30,"city":"Paris"},{"name":"Bob","age":25,"city":"London"},{"name":"Carol","age":35,"city":"Tokyo"}]';

export default function JsonToTable() {
  const [input, setInput]   = useState(SAMPLE);
  const [html, setHtml]     = useState("");
  const [error, setError]   = useState("");
  const [copied, setCopied] = useState(false);

  const run = () => {
    try { setError(""); setHtml(jsonToTable(input)); }
    catch (e) { setError(e instanceof Error ? e.message : "Invalid JSON"); setHtml(""); }
  };
  const copy = async () => { await navigator.clipboard.writeText(html); setCopied(true); setTimeout(() => setCopied(false), 1800); };
  const download = () => {
    const blob = new Blob([html], { type: "text/html" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "table.html"; a.click();
  };

  return (
    <div className="w-full space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">JSON Array Input</label>
        <textarea rows={7} value={input} onChange={e => { setInput(e.target.value); setHtml(""); setError(""); }}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-mono text-slate-700 bg-white
                     placeholder-slate-300 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>
      {error && <p className="text-sm text-red-500 font-mono">{error}</p>}
      <button onClick={run}
        className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl font-semibold text-white text-sm
                   bg-gradient-to-r from-slate-900 via-indigo-700 to-indigo-600 hover:-translate-y-0.5
                   shadow-[0_4px_20px_rgba(79,70,229,0.35)] transition-all">
        <Wand2 className="w-4 h-4" />Convert to Table
      </button>
      {html && (
        <div className="space-y-3 animate-fade-in">
          <div className="flex gap-2">
            <button onClick={copy} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-700 transition-colors">
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}{copied ? "Copied!" : "Copy HTML"}
            </button>
            <button onClick={download} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-colors">
              <Download className="w-3.5 h-3.5" />Download HTML
            </button>
          </div>
          <div className="rounded-xl border border-slate-200 overflow-x-auto bg-white p-4" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      )}
    </div>
  );
}

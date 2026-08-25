"use client";
import { useState } from "react";
import { deduplicateLines } from "@/lib/converters/textConverter";
import { Copy, Check } from "lucide-react";

export default function DeduplicateLines() {
  const [input, setInput]   = useState("");
  const [caseS, setCaseS]   = useState(true);
  const [result, setResult] = useState<{ output: string; removed: number } | null>(null);
  const [copied, setCopied] = useState(false);

  const run = () => {
    const { result: output, removed } = deduplicateLines(input, caseS);
    setResult({ output, removed });
  };

  return (
    <div className="w-full space-y-4">
      <textarea rows={8} value={input} onChange={e => { setInput(e.target.value); setResult(null); }}
        placeholder="Paste lines with duplicates…"
        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-mono
                   text-slate-700 bg-white placeholder-slate-300 resize-none
                   focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={caseS} onChange={e => setCaseS(e.target.checked)} className="accent-indigo-600" />
          <span className="text-sm text-slate-600">Case Sensitive</span>
        </label>
      </div>
      <button onClick={run} disabled={!input.trim()}
        className="w-full py-3.5 rounded-2xl font-semibold text-white text-sm
                   bg-gradient-to-r from-slate-900 via-indigo-700 to-indigo-600
                   hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed
                   shadow-[0_4px_20px_rgba(79,70,229,0.35)] transition-all">
        Remove Duplicates
      </button>
      {result && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${result.removed > 0 ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
              {result.removed} duplicate{result.removed !== 1 ? "s" : ""} removed
            </span>
            <button onClick={async () => { await navigator.clipboard.writeText(result.output); setCopied(true); setTimeout(() => setCopied(false), 1800); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-700 transition-colors">
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <textarea readOnly rows={8} value={result.output}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm
                       text-slate-700 bg-slate-50 resize-none focus:outline-none font-mono" />
        </div>
      )}
    </div>
  );
}

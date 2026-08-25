"use client";
import { useState } from "react";
import { findAndReplace } from "@/lib/converters/textConverter";
import { Copy, Check } from "lucide-react";

export default function FindReplace() {
  const [text, setText]       = useState("");
  const [find, setFind]       = useState("");
  const [replace, setReplace] = useState("");
  const [regex, setRegex]     = useState(false);
  const [caseS, setCaseS]     = useState(true);
  const [result, setResult]   = useState<{ output: string; count: number } | null>(null);
  const [copied, setCopied]   = useState(false);
  const [error, setError]     = useState("");

  const run = () => {
    try {
      setError("");
      const { result: output, count } = findAndReplace(text, find, replace, regex, caseS);
      setResult({ output, count });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid regex");
    }
  };

  const copy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="w-full space-y-4">
      <textarea rows={7} value={text} onChange={e => { setText(e.target.value); setResult(null); }}
        placeholder="Paste your text here…"
        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-700
                   bg-white placeholder-slate-300 resize-none focus:outline-none
                   focus:ring-2 focus:ring-indigo-500 transition-all font-mono" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Find</label>
          <input value={find} onChange={e => setFind(e.target.value)}
            placeholder={regex ? "Regular expression…" : "Text to find…"}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700
                       focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Replace with</label>
          <input value={replace} onChange={e => setReplace(e.target.value)}
            placeholder="Replacement text…"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700
                       focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
      </div>
      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={regex} onChange={e => setRegex(e.target.checked)} className="accent-indigo-600" />
          <span className="text-sm text-slate-600">Use Regex</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={caseS} onChange={e => setCaseS(e.target.checked)} className="accent-indigo-600" />
          <span className="text-sm text-slate-600">Case Sensitive</span>
        </label>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button onClick={run} disabled={!text || !find}
        className="w-full py-3.5 rounded-2xl font-semibold text-white text-sm
                   bg-gradient-to-r from-slate-900 via-indigo-700 to-indigo-600
                   hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed
                   shadow-[0_4px_20px_rgba(79,70,229,0.35)] transition-all">
        Find &amp; Replace
      </button>
      {result && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">{result.count} replacement{result.count !== 1 ? "s" : ""} made</p>
            <button onClick={copy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white
                         text-xs font-semibold hover:bg-slate-700 transition-colors">
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <textarea readOnly rows={7} value={result.output}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm
                       text-slate-700 bg-slate-50 resize-none focus:outline-none font-mono" />
        </div>
      )}
    </div>
  );
}

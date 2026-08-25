"use client";
import { useState } from "react";
import { validateJson, formatJson } from "@/lib/converters/dataConverter";
import { CheckCircle2, XCircle, Copy, Check, Wand2 } from "lucide-react";

export default function JsonValidator() {
  const [input, setInput]   = useState('{"name":"Alice","age":30}');
  const [result, setResult] = useState<{ valid: boolean; error?: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [formatted, setFormatted] = useState("");

  const run = () => {
    const r = validateJson(input);
    setResult(r);
    if (r.valid) { try { setFormatted(formatJson(input)); } catch { setFormatted(""); } }
    else setFormatted("");
  };
  const copy = async () => { await navigator.clipboard.writeText(formatted); setCopied(true); setTimeout(() => setCopied(false), 1800); };

  return (
    <div className="w-full space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">JSON Input</label>
        <textarea rows={10} value={input} onChange={e => { setInput(e.target.value); setResult(null); setFormatted(""); }}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-mono text-slate-700 bg-white
                     placeholder-slate-300 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>
      <button onClick={run}
        className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl font-semibold text-white text-sm
                   bg-gradient-to-r from-slate-900 via-indigo-700 to-indigo-600
                   hover:-translate-y-0.5 shadow-[0_4px_20px_rgba(79,70,229,0.35)] transition-all">
        <Wand2 className="w-4 h-4" />Validate JSON
      </button>
      {result && (
        <div className={`flex items-start gap-3 p-4 rounded-xl border ${result.valid ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"} animate-fade-in`}>
          {result.valid ? <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />}
          <div>
            <p className={`text-sm font-semibold ${result.valid ? "text-emerald-700" : "text-red-700"}`}>
              {result.valid ? "Valid JSON ✓" : "Invalid JSON"}
            </p>
            {result.error && <p className="text-xs text-red-600 font-mono mt-1">{result.error}</p>}
          </div>
        </div>
      )}
      {formatted && (
        <div className="space-y-1.5">
          <div className="flex justify-between">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Formatted</label>
            <button onClick={copy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-700 transition-colors">
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <textarea readOnly rows={10} value={formatted}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-mono text-slate-700 bg-slate-50 resize-none" />
        </div>
      )}
    </div>
  );
}

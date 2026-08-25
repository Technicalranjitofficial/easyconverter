"use client";
import { useState } from "react";
import { randomText } from "@/lib/converters/textConverter";
import { RefreshCw, Copy, Check } from "lucide-react";

export default function RandomText() {
  const [words, setWords]   = useState(50);
  const [output, setOutput] = useState(() => randomText(50));
  const [copied, setCopied] = useState(false);

  const gen = () => setOutput(randomText(words));

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Word Count</label>
          <input type="number" min={5} max={500} value={words} onChange={e => setWords(Number(e.target.value))}
            className="w-28 px-3 py-2 rounded-xl border border-slate-200 text-sm text-center
                       focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={gen}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-white text-sm
                     bg-gradient-to-r from-slate-900 via-indigo-700 to-indigo-600
                     hover:-translate-y-0.5 shadow-[0_4px_20px_rgba(79,70,229,0.35)] transition-all">
          <RefreshCw className="w-4 h-4" />Generate
        </button>
        <button onClick={async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1800); }}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm
                     bg-white border border-slate-200 text-slate-700 hover:border-slate-300 transition-all">
          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <textarea readOnly rows={7} value={output}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-700
                   bg-slate-50 resize-none focus:outline-none leading-relaxed" />
    </div>
  );
}

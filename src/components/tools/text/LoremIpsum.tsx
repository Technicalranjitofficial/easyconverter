"use client";
import { useState } from "react";
import { generateLorem } from "@/lib/converters/textConverter";
import { Copy, Check, RefreshCw } from "lucide-react";

export default function LoremIpsum() {
  const [paragraphs, setParagraphs]   = useState(3);
  const [sentences, setSentences]     = useState(5);
  const [output, setOutput]           = useState(() => generateLorem(3, 5));
  const [copied, setCopied]           = useState(false);

  const generate = () => setOutput(generateLorem(paragraphs, sentences));
  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="w-full space-y-5">
      <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
        <div className="px-4 py-2.5 bg-slate-900 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">Settings</span>
        </div>
        <div className="p-4 bg-white flex flex-wrap gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Paragraphs</label>
            <input type="number" min={1} max={20} value={paragraphs}
              onChange={e => setParagraphs(Number(e.target.value))}
              className="w-24 px-3 py-2 rounded-xl border border-slate-200 text-sm text-center
                         focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Sentences / ¶</label>
            <input type="number" min={1} max={15} value={sentences}
              onChange={e => setSentences(Number(e.target.value))}
              className="w-24 px-3 py-2 rounded-xl border border-slate-200 text-sm text-center
                         focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={generate}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-white text-sm
                     bg-gradient-to-r from-slate-900 via-indigo-700 to-indigo-600
                     hover:-translate-y-0.5 shadow-[0_4px_20px_rgba(79,70,229,0.35)] transition-all">
          <RefreshCw className="w-4 h-4" />Generate
        </button>
        <button onClick={copy}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm
                     bg-white border border-slate-200 text-slate-700 hover:border-slate-300 transition-all">
          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copied!" : "Copy All"}
        </button>
      </div>
      <textarea readOnly rows={12} value={output}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-700
                   bg-slate-50 resize-none focus:outline-none leading-relaxed" />
    </div>
  );
}

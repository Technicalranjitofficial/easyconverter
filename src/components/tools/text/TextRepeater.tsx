"use client";
import { useState } from "react";
import { repeatText } from "@/lib/converters/textConverter";
import { Copy, Check } from "lucide-react";

const SEPARATORS = [
  { label: "New Line",    value: "\n"   },
  { label: "Space",       value: " "    },
  { label: "Comma",       value: ", "   },
  { label: "Pipe",        value: " | "  },
  { label: "None",        value: ""     },
];

export default function TextRepeater() {
  const [text, setText]   = useState("");
  const [times, setTimes] = useState(3);
  const [sep, setSep]     = useState("\n");
  const [copied, setCopied] = useState(false);

  const output = text ? repeatText(text, times, sep) : "";

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="w-full space-y-4">
      <textarea rows={4} value={text} onChange={e => setText(e.target.value)}
        placeholder="Text to repeat…"
        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-700
                   bg-white placeholder-slate-300 resize-none focus:outline-none
                   focus:ring-2 focus:ring-indigo-500 transition-all" />
      <div className="flex flex-wrap gap-4 items-end">
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Repeat</label>
          <input type="number" min={1} max={500} value={times} onChange={e => setTimes(Number(e.target.value))}
            className="w-24 px-3 py-2 rounded-xl border border-slate-200 text-sm text-center
                       focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <span className="text-xs text-slate-400"> times</span>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Separator</label>
          <div className="flex rounded-xl overflow-hidden border border-slate-200 divide-x divide-slate-200">
            {SEPARATORS.map(s => (
              <button key={s.label} onClick={() => setSep(s.value)}
                className={`px-3 py-2 text-xs font-semibold transition-all ${
                  sep === s.value ? "bg-slate-900 text-white" : "bg-white text-slate-500 hover:bg-slate-50"
                }`}>{s.label}</button>
            ))}
          </div>
        </div>
      </div>
      {output && (
        <div className="space-y-1.5">
          <div className="flex justify-between">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Output</label>
            <button onClick={copy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-700 transition-colors">
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <textarea readOnly rows={8} value={output}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-700
                       bg-slate-50 resize-none focus:outline-none" />
        </div>
      )}
    </div>
  );
}

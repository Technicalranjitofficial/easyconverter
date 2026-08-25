"use client";
import { useState } from "react";
import { diffTexts, type DiffLine } from "@/lib/converters/textConverter";

export default function DiffChecker() {
  const [original, setOriginal] = useState("");
  const [modified, setModified] = useState("");
  const [diff, setDiff]         = useState<DiffLine[] | null>(null);

  const run = () => setDiff(diffTexts(original, modified));

  const added   = diff?.filter(d => d.type === "added").length   ?? 0;
  const removed = diff?.filter(d => d.type === "removed").length ?? 0;

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Original</label>
          <textarea rows={8} value={original} onChange={e => { setOriginal(e.target.value); setDiff(null); }}
            placeholder="Paste original text…"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-mono
                       text-slate-700 bg-white placeholder-slate-300 resize-none focus:outline-none
                       focus:ring-2 focus:ring-indigo-500 transition-all" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Modified</label>
          <textarea rows={8} value={modified} onChange={e => { setModified(e.target.value); setDiff(null); }}
            placeholder="Paste modified text…"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-mono
                       text-slate-700 bg-white placeholder-slate-300 resize-none focus:outline-none
                       focus:ring-2 focus:ring-indigo-500 transition-all" />
        </div>
      </div>
      <button onClick={run} disabled={!original || !modified}
        className="w-full py-3.5 rounded-2xl font-semibold text-white text-sm
                   bg-gradient-to-r from-slate-900 via-indigo-700 to-indigo-600
                   hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed
                   shadow-[0_4px_20px_rgba(79,70,229,0.35)] transition-all">
        Compare Texts
      </button>
      {diff && (
        <div className="space-y-2">
          <div className="flex gap-4 text-xs">
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold">+{added} added</span>
            <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-700 font-semibold">-{removed} removed</span>
          </div>
          <div className="rounded-2xl overflow-hidden border border-slate-200 font-mono text-sm max-h-96 overflow-y-auto">
            {diff.map((line, i) => (
              <div key={i} className={`px-4 py-1.5 flex gap-3 ${
                line.type === "added"   ? "bg-emerald-50 text-emerald-800" :
                line.type === "removed" ? "bg-red-50 text-red-800"         : "bg-white text-slate-600"
              }`}>
                <span className="select-none w-4 flex-shrink-0 text-xs opacity-60">
                  {line.type === "added" ? "+" : line.type === "removed" ? "−" : " "}
                </span>
                <span className="whitespace-pre-wrap break-all">{line.text || " "}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

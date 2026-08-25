"use client";
import { useState } from "react";
import { jsonDiff, type JsonDiffLine } from "@/lib/converters/dataConverter";

export default function JsonDiff() {
  const [a, setA] = useState('{"name":"Alice","age":30,"city":"Paris"}');
  const [b, setB] = useState('{"name":"Alice","age":31,"country":"France"}');
  const [diff, setDiff] = useState<JsonDiffLine[] | null>(null);
  const [error, setError] = useState("");

  const run = () => {
    try { setError(""); setDiff(jsonDiff(a, b)); }
    catch (e) { setError(e instanceof Error ? e.message : "Invalid JSON"); setDiff(null); }
  };

  const counts = diff ? {
    added:   diff.filter(d => d.type === "added").length,
    removed: diff.filter(d => d.type === "removed").length,
    changed: diff.filter(d => d.type === "changed").length,
  } : null;

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[["JSON A (Original)", a, setA], ["JSON B (Modified)", b, setB]].map(([label, val, setter]) => (
          <div key={label as string} className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">{label as string}</label>
            <textarea rows={6} value={val as string} onChange={e => { (setter as (v: string) => void)(e.target.value); setDiff(null); }}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-mono text-slate-700 bg-white resize-none
                         focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        ))}
      </div>
      {error && <p className="text-sm text-red-500 font-mono">{error}</p>}
      <button onClick={run} disabled={!a || !b}
        className="w-full py-3.5 rounded-2xl font-semibold text-white text-sm
                   bg-gradient-to-r from-slate-900 via-indigo-700 to-indigo-600
                   hover:-translate-y-0.5 disabled:opacity-50 shadow-[0_4px_20px_rgba(79,70,229,0.35)] transition-all">
        Compare JSON
      </button>
      {counts && (
        <div className="flex gap-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">+{counts.added} added</span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-50 text-red-700">-{counts.removed} removed</span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700">~{counts.changed} changed</span>
        </div>
      )}
      {diff && (
        <div className="rounded-2xl overflow-hidden border border-slate-200 font-mono text-sm">
          {diff.map((line, i) => (
            <div key={i} className={`px-4 py-2 flex items-start gap-3 border-b border-slate-100 last:border-0 ${
              line.type === "added"   ? "bg-emerald-50" :
              line.type === "removed" ? "bg-red-50"     :
              line.type === "changed" ? "bg-amber-50"   : "bg-white"
            }`}>
              <span className="text-[10px] font-bold w-14 flex-shrink-0 mt-0.5 uppercase tracking-wide text-slate-400">{line.type}</span>
              <span className="font-semibold text-slate-700 w-28 flex-shrink-0 truncate">{line.key}</span>
              <div className="flex-1 min-w-0 text-xs">
                {line.type === "changed" && (
                  <div>
                    <span className="text-red-600 line-through">{line.a}</span>
                    <span className="text-slate-400 mx-2">→</span>
                    <span className="text-emerald-600">{line.b}</span>
                  </div>
                )}
                {line.type === "added"   && <span className="text-emerald-700">{line.b}</span>}
                {line.type === "removed" && <span className="text-red-700">{line.a}</span>}
                {line.type === "same"    && <span className="text-slate-400">{line.a}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

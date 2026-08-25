"use client";
import { useState, useMemo } from "react";

export default function RegexTester() {
  const [pattern, setPattern] = useState("[A-Z][a-z]+");
  const [flags, setFlags]     = useState("g");
  const [text, setText]       = useState("Hello World, this is a Regex Tester.");
  const [error, setError]     = useState("");

  const { matches, highlighted } = useMemo(() => {
    if (!pattern) return { matches: [], highlighted: text };
    try {
      setError("");
      const re = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
      const ms: { index: number; value: string }[] = [];
      let m: RegExpExecArray | null;
      re.lastIndex = 0;
      while ((m = re.exec(text)) !== null) {
        ms.push({ index: m.index, value: m[0] });
        if (!flags.includes("g")) break;
      }
      // Build highlighted HTML
      let result = "";
      let last = 0;
      re.lastIndex = 0;
      while ((m = re.exec(text)) !== null) {
        result += text.slice(last, m.index).replace(/</g,"&lt;");
        result += `<mark class="bg-yellow-200 rounded">${m[0].replace(/</g,"&lt;")}</mark>`;
        last = m.index + m[0].length;
        if (!flags.includes("g")) break;
      }
      result += text.slice(last).replace(/</g,"&lt;");
      return { matches: ms, highlighted: result };
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid regex");
      return { matches: [], highlighted: text.replace(/</g,"&lt;") };
    }
  }, [pattern, flags, text]);

  return (
    <div className="w-full space-y-4">
      {/* Pattern + flags */}
      <div className="flex gap-3">
        <div className="flex-1 space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Pattern</label>
          <div className="flex items-center rounded-xl border border-slate-200 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500">
            <span className="px-3 text-slate-400 font-mono text-sm select-none">/</span>
            <input value={pattern} onChange={e => setPattern(e.target.value)}
              placeholder="regex pattern…"
              className="flex-1 py-2.5 text-sm font-mono text-slate-700 bg-transparent focus:outline-none" />
            <span className="px-3 text-slate-400 font-mono text-sm select-none">/</span>
            <input value={flags} onChange={e => setFlags(e.target.value.replace(/[^gimsuy]/g,""))}
              className="w-16 py-2.5 px-2 text-sm font-mono text-slate-700 bg-transparent focus:outline-none border-l border-slate-200"
              placeholder="gim" />
          </div>
        </div>
      </div>
      {error && <p className="text-sm text-red-500 font-mono">{error}</p>}
      {/* Test string */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Test String</label>
        <textarea rows={4} value={text} onChange={e => setText(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-700
                     bg-white placeholder-slate-300 resize-none focus:outline-none
                     focus:ring-2 focus:ring-indigo-500 font-mono" />
      </div>
      {/* Matches */}
      <div className="flex items-center gap-2">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
          matches.length > 0 ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
        }`}>{matches.length} match{matches.length !== 1 ? "es" : ""}</span>
      </div>
      {/* Highlighted output */}
      {!error && (
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Highlighted</label>
          <div className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-mono text-slate-700 whitespace-pre-wrap break-all leading-relaxed"
            dangerouslySetInnerHTML={{ __html: highlighted }} />
        </div>
      )}
      {/* Match list */}
      {matches.length > 0 && (
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500">All Matches</label>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {matches.map((m, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white border border-slate-100 text-sm">
                <span className="text-xs font-mono text-slate-400 w-8">#{i+1}</span>
                <span className="font-mono text-slate-800 flex-1">{m.value}</span>
                <span className="text-xs text-slate-400">at {m.index}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

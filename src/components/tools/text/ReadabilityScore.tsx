"use client";
import { useState } from "react";
import { readabilityScore } from "@/lib/converters/textConverter";

export default function ReadabilityScore() {
  const [text, setText] = useState("");
  const result = text.trim().split(/\s+/).length > 5 ? readabilityScore(text) : null;

  const scoreColor = result
    ? result.fleschScore >= 70 ? "text-emerald-600"
    : result.fleschScore >= 50 ? "text-amber-600" : "text-red-600"
    : "";

  return (
    <div className="w-full space-y-4">
      <textarea rows={8} value={text} onChange={e => setText(e.target.value)}
        placeholder="Paste your text to check readability…"
        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-700
                   bg-white placeholder-slate-300 resize-none focus:outline-none
                   focus:ring-2 focus:ring-indigo-500 transition-all leading-relaxed" />
      {result && (
        <div className="space-y-4 animate-fade-in">
          {/* Score */}
          <div className="flex items-center justify-between p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Flesch Reading Ease</p>
              <p className={`text-4xl font-black tabular-nums ${scoreColor}`}>{result.fleschScore}</p>
              <p className="text-sm text-slate-500 mt-1">{result.difficulty}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">Grade Level</p>
              <p className="text-lg font-bold text-slate-700">{result.grade}</p>
            </div>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Avg Sentence Length",    value: `${result.avgSentenceLength} words` },
              { label: "Avg Syllables / Word",   value: String(result.avgSyllablesPerWord)  },
            ].map(s => (
              <div key={s.label} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-xs text-slate-400 mb-1">{s.label}</p>
                <p className="text-lg font-bold text-slate-800">{s.value}</p>
              </div>
            ))}
          </div>
          {/* Score scale */}
          <div className="rounded-xl border border-slate-200 overflow-hidden text-xs">
            {[
              { range: "90–100", level: "5th grade",       diff: "Very Easy"      },
              { range: "80–89",  level: "6th grade",       diff: "Easy"           },
              { range: "70–79",  level: "7th grade",       diff: "Fairly Easy"    },
              { range: "60–69",  level: "8–9th grade",     diff: "Standard"       },
              { range: "50–59",  level: "10–12th grade",   diff: "Fairly Difficult" },
              { range: "30–49",  level: "College",         diff: "Difficult"      },
              { range: "0–29",   level: "College+",        diff: "Very Confusing" },
            ].map(row => (
              <div key={row.range} className={`flex items-center gap-3 px-4 py-2 border-b border-slate-100 last:border-0 ${
                result.fleschScore >= parseInt(row.range) && result.fleschScore <= parseInt(row.range.split("–")[1] ?? "100")
                  ? "bg-indigo-50" : "bg-white"
              }`}>
                <span className="font-mono w-14 text-slate-400">{row.range}</span>
                <span className="text-slate-600">{row.diff}</span>
                <span className="ml-auto text-slate-400">{row.level}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {!result && text.trim() && (
        <p className="text-sm text-slate-400 text-center py-4">Need at least 6 words for analysis…</p>
      )}
    </div>
  );
}

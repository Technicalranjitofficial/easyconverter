"use client";
import { useState } from "react";
import { analyzeText } from "@/lib/converters/textConverter";

export default function WordCounter() {
  const [text, setText] = useState("");
  const s = analyzeText(text);
  return (
    <div className="w-full space-y-4">
      <textarea rows={8} value={text} onChange={e => setText(e.target.value)}
        placeholder="Type or paste your text here…"
        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-700
                   bg-white placeholder-slate-300 resize-none focus:outline-none
                   focus:ring-2 focus:ring-indigo-500 transition-all leading-relaxed" />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: "Words",       value: s.words },
          { label: "Characters",  value: s.chars },
          { label: "No Spaces",   value: s.charsNoSpaces },
          { label: "Sentences",   value: s.sentences },
          { label: "Lines",       value: s.lines },
          { label: "Paragraphs",  value: s.paragraphs },
          { label: "Reading Time",value: `~${s.readingTimeMin} min` },
        ].map(stat => (
          <div key={stat.label} className="flex flex-col items-center p-4 rounded-2xl
                                           bg-white border border-slate-100 shadow-sm">
            <span className="text-2xl font-bold text-slate-900 tabular-nums">{stat.value}</span>
            <span className="text-xs text-slate-400 mt-1">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

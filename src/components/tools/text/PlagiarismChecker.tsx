"use client";
import { useState } from "react";
import { similarityScore } from "@/lib/converters/textConverter";

export default function PlagiarismChecker() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [score, setScore] = useState<number | null>(null);

  const check = () => setScore(similarityScore(text1, text2));

  const color = score === null ? "" :
    score >= 80 ? "text-red-600" :
    score >= 50 ? "text-amber-600" : "text-emerald-600";

  const label = score === null ? "" :
    score >= 80 ? "High similarity — possible plagiarism" :
    score >= 50 ? "Moderate similarity" : "Low similarity — mostly original";

  return (
    <div className="w-full space-y-4">
      <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-700">
        <strong>Note:</strong> This is a basic word-overlap similarity checker, not a full plagiarism detection system.
        It compares two texts you provide — it does not search the internet.
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Text 1 (Original)</label>
          <textarea rows={8} value={text1} onChange={e => { setText1(e.target.value); setScore(null); }}
            placeholder="Paste original text…"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-700
                       bg-white placeholder-slate-300 resize-none focus:outline-none
                       focus:ring-2 focus:ring-indigo-500 transition-all" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Text 2 (To Check)</label>
          <textarea rows={8} value={text2} onChange={e => { setText2(e.target.value); setScore(null); }}
            placeholder="Paste text to compare…"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-700
                       bg-white placeholder-slate-300 resize-none focus:outline-none
                       focus:ring-2 focus:ring-indigo-500 transition-all" />
        </div>
      </div>
      <button onClick={check} disabled={!text1.trim() || !text2.trim()}
        className="w-full py-3.5 rounded-2xl font-semibold text-white text-sm
                   bg-gradient-to-r from-slate-900 via-indigo-700 to-indigo-600
                   hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed
                   shadow-[0_4px_20px_rgba(79,70,229,0.35)] transition-all">
        Check Similarity
      </button>
      {score !== null && (
        <div className="flex flex-col items-center gap-2 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm animate-fade-in">
          <span className={`text-6xl font-black tabular-nums ${color}`}>{score}%</span>
          <span className={`text-sm font-semibold ${color}`}>{label}</span>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mt-2">
            <div className={`h-full rounded-full transition-all duration-500 ${
              score >= 80 ? "bg-red-500" : score >= 50 ? "bg-amber-500" : "bg-emerald-500"
            }`} style={{ width: `${score}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}

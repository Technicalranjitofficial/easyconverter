"use client";
import { useState } from "react";
import { Copy, Check, Hash } from "lucide-react";

type Algorithm = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";
const ALGOS: Algorithm[] = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"];

async function hashText(text: string, algo: Algorithm): Promise<string> {
  const enc  = new TextEncoder();
  const buf  = await crypto.subtle.digest(algo, enc.encode(text));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

export default function HashGenerator() {
  const [input, setInput]   = useState("");
  const [algo, setAlgo]     = useState<Algorithm>("SHA-256");
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const [all, setAll]       = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const run = async () => {
    if (!input) return;
    const algos = all ? ALGOS : [algo];
    const result: Record<string, string> = {};
    for (const a of algos) result[a] = await hashText(input, a);
    setHashes(result);
  };

  const copy = async (key: string, val: string) => {
    await navigator.clipboard.writeText(val);
    setCopied(key); setTimeout(() => setCopied(null), 1800);
  };

  return (
    <div className="w-full space-y-4">
      <textarea rows={4} value={input} onChange={e => { setInput(e.target.value); setHashes({}); }}
        placeholder="Enter text to hash…"
        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-700
                   bg-white placeholder-slate-300 resize-none focus:outline-none
                   focus:ring-2 focus:ring-indigo-500 transition-all" />
      <div className="flex flex-wrap items-center gap-4">
        {!all && (
          <div className="flex gap-1.5">
            {ALGOS.map(a => (
              <button key={a} onClick={() => setAlgo(a)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  algo === a ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                }`}>{a}</button>
            ))}
          </div>
        )}
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={all} onChange={e => setAll(e.target.checked)} className="accent-indigo-600" />
          <span className="text-sm text-slate-600">All algorithms</span>
        </label>
      </div>
      <button onClick={run} disabled={!input.trim()}
        className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl font-semibold text-white text-sm
                   bg-gradient-to-r from-slate-900 via-indigo-700 to-indigo-600
                   hover:-translate-y-0.5 disabled:opacity-50 shadow-[0_4px_20px_rgba(79,70,229,0.35)] transition-all">
        <Hash className="w-4 h-4" />Generate Hash
      </button>
      {Object.entries(hashes).map(([key, val]) => (
        <div key={key} className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-400">{key}</label>
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-200 bg-white">
            <span className="flex-1 font-mono text-xs text-slate-800 break-all">{val}</span>
            <button onClick={() => copy(key, val)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-700 transition-colors flex-shrink-0">
              {copied === key ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

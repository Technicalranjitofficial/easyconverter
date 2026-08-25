"use client";
import { useState } from "react";
import { Copy, Check, RefreshCw } from "lucide-react";

function generateUUID(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function UuidGenerator() {
  const [count, setCount] = useState(5);
  const [uuids, setUuids] = useState<string[]>(() => Array.from({ length: 5 }, generateUUID));
  const [copied, setCopied] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const generate = () => setUuids(Array.from({ length: count }, generateUUID));

  const copy = async (idx: number) => {
    await navigator.clipboard.writeText(uuids[idx]);
    setCopied(idx); setTimeout(() => setCopied(null), 1800);
  };
  const copyAll = async () => {
    await navigator.clipboard.writeText(uuids.join("\n"));
    setCopiedAll(true); setTimeout(() => setCopiedAll(false), 1800);
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Count</label>
          <input type="number" min={1} max={50} value={count} onChange={e => setCount(Number(e.target.value))}
            className="w-24 px-3 py-2 rounded-xl border border-slate-200 text-sm text-center
                       focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={generate}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-white text-sm
                     bg-gradient-to-r from-slate-900 via-indigo-700 to-indigo-600
                     hover:-translate-y-0.5 shadow-[0_4px_20px_rgba(79,70,229,0.35)] transition-all">
          <RefreshCw className="w-4 h-4" />Generate
        </button>
        <button onClick={copyAll}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm
                     bg-white border border-slate-200 text-slate-700 hover:border-slate-300 transition-all">
          {copiedAll ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          {copiedAll ? "Copied!" : "Copy All"}
        </button>
      </div>
      <div className="space-y-1.5">
        {uuids.map((uuid, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-slate-200 bg-white">
            <span className="flex-1 font-mono text-sm text-slate-800">{uuid}</span>
            <button onClick={() => copy(i)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-700 transition-colors flex-shrink-0">
              {copied === i ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

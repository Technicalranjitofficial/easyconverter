"use client";
import { useState, useCallback } from "react";
import { Copy, Check, RefreshCw, Shield } from "lucide-react";

const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const NUMS  = "0123456789";
const SYMS  = "!@#$%^&*()_+-=[]{}|;:,.<>?";

function strengthLabel(score: number): { label: string; color: string } {
  if (score < 2) return { label: "Weak",   color: "text-red-600"   };
  if (score < 3) return { label: "Fair",   color: "text-amber-600" };
  if (score < 4) return { label: "Strong", color: "text-blue-600"  };
  return              { label: "Very Strong", color: "text-emerald-600" };
}

export default function PasswordGenerator() {
  const [length, setLength]   = useState(16);
  const [upper, setUpper]     = useState(true);
  const [lower, setLower]     = useState(true);
  const [nums,  setNums]      = useState(true);
  const [syms,  setSyms]      = useState(true);
  const [count, setCount]     = useState(5);
  const [passwords, setPasswords] = useState<string[]>([]);
  const [copied, setCopied]   = useState<number | null>(null);

  const generate = useCallback(() => {
    let charset = "";
    if (upper) charset += UPPER;
    if (lower) charset += LOWER;
    if (nums)  charset += NUMS;
    if (syms)  charset += SYMS;
    if (!charset) return;

    const arr: string[] = [];
    for (let p = 0; p < count; p++) {
      const pw: string[] = [];
      const randBytes = crypto.getRandomValues(new Uint32Array(length));
      for (let i = 0; i < length; i++) {
        pw.push(charset[randBytes[i] % charset.length]);
      }
      arr.push(pw.join(""));
    }
    setPasswords(arr);
  }, [length, upper, lower, nums, syms, count]);

  const copy = async (idx: number) => {
    await navigator.clipboard.writeText(passwords[idx]);
    setCopied(idx);
    setTimeout(() => setCopied(null), 1800);
  };

  const score = [upper, lower, nums, syms].filter(Boolean).length;
  const { label: strLabel, color: strColor } = strengthLabel(score);

  return (
    <div className="w-full space-y-5">
      <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
        <div className="px-4 py-2.5 bg-slate-900 flex items-center gap-2">
          <Shield className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">Settings</span>
          {passwords.length > 0 && (
            <span className={`ml-auto text-xs font-semibold ${strColor}`}>Strength: {strLabel}</span>
          )}
        </div>
        <div className="p-4 bg-white space-y-4">
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Length</label>
              <span className="text-xs font-mono font-semibold text-indigo-600">{length}</span>
            </div>
            <input type="range" min={4} max={128} value={length} onChange={e => setLength(Number(e.target.value))}
              className="w-full accent-indigo-500 h-2 rounded-full cursor-pointer" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[["Uppercase A-Z", upper, setUpper], ["Lowercase a-z", lower, setLower], ["Numbers 0-9", nums, setNums], ["Symbols !@#", syms, setSyms]].map(([label, val, setter]) => (
              <label key={label as string} className={`flex items-center gap-2 p-3 rounded-xl cursor-pointer border transition-all ${
                val ? "bg-indigo-50 border-indigo-200" : "bg-slate-50 border-slate-200 hover:border-slate-300"
              }`}>
                <input type="checkbox" checked={val as boolean}
                  onChange={e => (setter as (v: boolean) => void)(e.target.checked)}
                  className="accent-indigo-600 w-4 h-4 rounded flex-shrink-0" />
                <span className="text-xs font-medium text-slate-700">{label as string}</span>
              </label>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 flex-shrink-0">Count</label>
            <input type="number" min={1} max={20} value={count} onChange={e => setCount(Number(e.target.value))}
              className="w-20 px-3 py-2 rounded-xl border border-slate-200 text-sm text-center
                         focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>
      </div>
      <button onClick={generate}
        className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl font-semibold text-white text-sm
                   bg-gradient-to-r from-slate-900 via-indigo-700 to-indigo-600
                   hover:-translate-y-0.5 shadow-[0_4px_20px_rgba(79,70,229,0.35)] transition-all">
        <RefreshCw className="w-4 h-4" />Generate {count} Password{count !== 1 ? "s" : ""}
      </button>
      {passwords.length > 0 && (
        <div className="space-y-2">
          {passwords.map((pw, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-white">
              <span className="flex-1 font-mono text-sm text-slate-800 break-all">{pw}</span>
              <button onClick={() => copy(i)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-700 transition-colors flex-shrink-0">
                {copied === i ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied === i ? "Copied!" : "Copy"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

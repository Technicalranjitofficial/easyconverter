"use client";
import { useState } from "react";
import { convertColor, type ColorResult } from "@/lib/converters/codeConverter";
import { Copy, Check } from "lucide-react";

export default function ColorConverter() {
  const [input, setInput]   = useState("#6366f1");
  const [result, setResult] = useState<ColorResult | null>(null);
  const [error, setError]   = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const run = () => {
    try { setError(""); setResult(convertColor(input)); }
    catch { setError("Invalid color. Try #rrggbb, rgb(r,g,b) or hsl(h,s%,l%)."); setResult(null); }
  };

  const copy = async (key: string, val: string) => {
    await navigator.clipboard.writeText(val);
    setCopied(key); setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="w-full space-y-5">
      <div className="flex gap-3 items-end">
        <div className="flex-1 space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Color Value</label>
          <input value={input} onChange={e => { setInput(e.target.value); setResult(null); }}
            placeholder="#rrggbb or rgb() or hsl()…"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono
                       text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <input type="color" value={result?.hex ?? input} onChange={e => setInput(e.target.value)}
          className="w-12 h-12 rounded-xl border-2 border-slate-200 cursor-pointer p-0.5 bg-white flex-shrink-0" />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button onClick={run}
        className="w-full py-3.5 rounded-2xl font-semibold text-white text-sm
                   bg-gradient-to-r from-slate-900 via-indigo-700 to-indigo-600
                   hover:-translate-y-0.5 shadow-[0_4px_20px_rgba(79,70,229,0.35)] transition-all">
        Convert Color
      </button>
      {result && (
        <div className="space-y-3 animate-fade-in">
          {/* Preview */}
          <div className="h-20 rounded-2xl border border-slate-200 shadow-sm" style={{ background: result.hex }} />
          {/* Values */}
          {[["HEX", result.hex], ["RGB", result.rgb], ["RGBA", result.rgba], ["HSL", result.hsl]].map(([label, val]) => (
            <div key={label} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-white">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400 w-10 flex-shrink-0">{label}</span>
              <span className="flex-1 font-mono text-sm text-slate-800">{val}</span>
              <button onClick={() => copy(label, val)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors flex-shrink-0">
                {copied === label ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";
import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function Base64Tool() {
  const [input, setInput]   = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode]     = useState<"encode" | "decode">("encode");
  const [error, setError]   = useState("");
  const [copied, setCopied] = useState(false);

  const run = () => {
    setError(""); setOutput("");
    try {
      if (mode === "encode") {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        setOutput(decodeURIComponent(escape(atob(input.trim()))));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid Base64 input.");
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true); setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex gap-2">
        {(["encode", "decode"] as const).map(m => (
          <button key={m} onClick={() => { setMode(m); setOutput(""); setError(""); }}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
              mode === m ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"
            }`}>
            {m === "encode" ? "Encode" : "Decode"}
          </button>
        ))}
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
          {mode === "encode" ? "Text to Encode" : "Base64 to Decode"}
        </label>
        <textarea rows={6} value={input} onChange={e => { setInput(e.target.value); setOutput(""); setError(""); }}
          placeholder={mode === "encode" ? "Enter text…" : "Paste Base64 string…"}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-mono
                     text-slate-700 bg-white placeholder-slate-300 resize-none focus:outline-none
                     focus:ring-2 focus:ring-indigo-500 transition-all" />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button onClick={run} disabled={!input.trim()}
        className="w-full py-3.5 rounded-2xl font-semibold text-white text-sm
                   bg-gradient-to-r from-slate-900 via-indigo-700 to-indigo-600
                   hover:-translate-y-0.5 disabled:opacity-50 shadow-[0_4px_20px_rgba(79,70,229,0.35)] transition-all">
        {mode === "encode" ? "Encode to Base64" : "Decode from Base64"}
      </button>
      {output && (
        <div className="space-y-1.5">
          <div className="flex justify-between">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Result</label>
            <button onClick={copy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-700 transition-colors">
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <textarea readOnly rows={6} value={output}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-mono
                       text-slate-700 bg-slate-50 resize-none focus:outline-none" />
        </div>
      )}
    </div>
  );
}

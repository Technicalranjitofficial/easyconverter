"use client";

import { useState, ReactNode } from "react";
import { Copy, Check, Download, Wand2, AlertCircle } from "lucide-react";

interface CodeEditorShellProps {
  inputLabel?: string;
  outputLabel?: string;
  inputPlaceholder?: string;
  outputPlaceholder?: string;
  language?: string;   // for display only
  transform: (input: string) => string;
  actionLabel?: string;
  /** Multiple action modes (e.g. Format / Minify) */
  modes?: { label: string; fn: (input: string) => string }[];
  downloadFileName?: string;
  /** Show input + output side by side on large screens */
  sideBySide?: boolean;
  /** Optional stats below input */
  showStats?: boolean;
  /** Optional custom content rendered below the output */
  children?: ReactNode;
}

export default function CodeEditorShell({
  inputLabel = "Input",
  outputLabel = "Output",
  inputPlaceholder = "Paste your code here…",
  outputPlaceholder = "Result will appear here…",
  transform,
  actionLabel = "Process",
  modes,
  downloadFileName = "output.txt",
  sideBySide = false,
  showStats = false,
  children,
}: CodeEditorShellProps) {
  const [input, setInput]     = useState("");
  const [output, setOutput]   = useState("");
  const [modeIdx, setModeIdx] = useState(0);
  const [error, setError]     = useState<string | null>(null);
  const [copied, setCopied]   = useState(false);

  const activeFn = modes ? modes[modeIdx].fn : transform;

  const handleRun = () => {
    if (!input.trim()) return;
    try {
      setError(null);
      setOutput(activeFn(input));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Processing failed.");
      setOutput("");
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const download = () => {
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = downloadFileName; a.click();
    URL.revokeObjectURL(url);
  };

  const inputLines = input ? input.split("\n").length : 0;
  const inputChars = input.length;

  const editors = (
    <div className={`${sideBySide ? "grid grid-cols-1 lg:grid-cols-2 gap-4" : "space-y-4"}`}>
      {/* Input */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500">{inputLabel}</label>
          {showStats && input && (
            <span className="text-[10px] text-slate-400">{inputLines} lines · {inputChars} chars</span>
          )}
        </div>
        <textarea
          rows={12}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={inputPlaceholder}
          spellCheck={false}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-mono
                     text-slate-700 bg-white placeholder-slate-300 resize-none
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all
                     leading-relaxed"
        />
      </div>

      {/* Output */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500">{outputLabel}</label>
          {output && (
            <div className="flex gap-2">
              <button onClick={copy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white
                           text-xs font-semibold hover:bg-slate-700 transition-colors">
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy"}
              </button>
              <button onClick={download}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white
                           text-xs font-semibold hover:bg-indigo-500 transition-colors">
                <Download className="w-3.5 h-3.5" />DL
              </button>
            </div>
          )}
        </div>
        <textarea
          readOnly
          rows={12}
          value={output}
          placeholder={outputPlaceholder}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-mono
                     text-slate-700 bg-slate-50 resize-none focus:outline-none leading-relaxed"
        />
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-4">
      {/* Mode tabs */}
      {modes && modes.length > 1 && (
        <div className="flex flex-wrap gap-1.5">
          {modes.map((m, i) => (
            <button key={m.label} onClick={() => setModeIdx(i)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                modeIdx === i
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
              }`}>
              {m.label}
            </button>
          ))}
        </div>
      )}

      {editors}

      {/* Run button */}
      <button
        onClick={handleRun}
        disabled={!input.trim()}
        className="w-full flex items-center justify-center gap-2.5
                   py-3.5 rounded-2xl font-semibold text-white text-sm
                   bg-gradient-to-r from-slate-900 via-indigo-700 to-indigo-600
                   hover:from-slate-800 hover:via-indigo-600 hover:to-indigo-500
                   disabled:opacity-50 disabled:cursor-not-allowed
                   shadow-[0_4px_20px_rgba(79,70,229,0.35)]
                   hover:-translate-y-0.5 transition-all duration-200"
      >
        <Wand2 className="w-4 h-4" />
        {modes ? modes[modeIdx].label : actionLabel}
      </button>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2.5 p-3 bg-red-50 rounded-xl border border-red-200">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 font-mono leading-relaxed">{error}</p>
        </div>
      )}

      {children}
    </div>
  );
}

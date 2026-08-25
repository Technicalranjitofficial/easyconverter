"use client";

import { useState, ReactNode } from "react";
import { Copy, Check, Download, RotateCcw, Wand2 } from "lucide-react";

interface TextToolShellProps {
  /** The input label shown above the textarea */
  inputLabel?: string;
  /** The output label shown above the result */
  outputLabel?: string;
  /** Placeholder text for the input */
  placeholder?: string;
  /** Transform function: receives input string, returns output string */
  transform: (input: string) => string;
  /** Action button label */
  actionLabel?: string;
  /** Show input stats (word/char count) */
  showStats?: boolean;
  /** Show copy/download on output */
  showActions?: boolean;
  /** Allow multiple transform modes — shown as tab buttons */
  modes?: { label: string; fn: (input: string) => string }[];
  /** Custom action section (rendered instead of auto output) */
  children?: ReactNode;
  /** Output file name for download */
  downloadFileName?: string;
}

export default function TextToolShell({
  inputLabel = "Input",
  outputLabel = "Output",
  placeholder = "Paste or type your text here…",
  transform,
  actionLabel = "Convert",
  showStats = true,
  showActions = true,
  modes,
  children,
  downloadFileName = "output.txt",
}: TextToolShellProps) {
  const [input, setInput]       = useState("");
  const [output, setOutput]     = useState("");
  const [modeIdx, setModeIdx]   = useState(0);
  const [copied, setCopied]     = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const activeFn = modes ? modes[modeIdx].fn : transform;

  const handleRun = () => {
    if (!input.trim()) return;
    try {
      setError(null);
      setOutput(activeFn(input));
    } catch (e) {
      setError(e instanceof Error ? e.message : "An error occurred.");
      setOutput("");
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = downloadFileName; a.click();
    URL.revokeObjectURL(url);
  };

  const wordCount = input.trim() ? input.trim().split(/\s+/).length : 0;
  const charCount = input.length;
  const lineCount = input ? input.split("\n").length : 0;

  return (
    <div className="w-full space-y-4">
      {/* Mode tabs */}
      {modes && modes.length > 1 && (
        <div className="flex flex-wrap gap-1.5">
          {modes.map((m, i) => (
            <button key={m.label} onClick={() => setModeIdx(i)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                modeIdx === i
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
              }`}>
              {m.label}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500">{inputLabel}</label>
          {showStats && input && (
            <div className="flex items-center gap-3 text-[10px] text-slate-400">
              <span>{wordCount} word{wordCount !== 1 ? "s" : ""}</span>
              <span>{charCount} char{charCount !== 1 ? "s" : ""}</span>
              <span>{lineCount} line{lineCount !== 1 ? "s" : ""}</span>
            </div>
          )}
        </div>
        <textarea
          rows={7}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-700
                     bg-white placeholder-slate-300 resize-none
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                     transition-all font-mono leading-relaxed"
        />
        {input && (
          <button onClick={() => { setInput(""); setOutput(""); setError(null); }}
            className="text-[11px] text-slate-400 hover:text-red-400 flex items-center gap-1 transition-colors">
            <RotateCcw className="w-3 h-3" />Clear
          </button>
        )}
      </div>

      {/* Action button */}
      <button
        onClick={handleRun}
        disabled={!input.trim()}
        className="w-full flex items-center justify-center gap-2.5
                   py-3.5 px-8 rounded-2xl font-semibold text-white text-sm
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
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">{error}</p>
      )}

      {/* Custom children (replaces output when provided) */}
      {children}

      {/* Output */}
      {!children && output && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">{outputLabel}</label>
            {showActions && (
              <div className="flex gap-2">
                <button onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                             bg-slate-900 text-white text-xs font-semibold hover:bg-slate-700 transition-colors">
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
                <button onClick={handleDownload}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                             bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-colors">
                  <Download className="w-3.5 h-3.5" />Download
                </button>
              </div>
            )}
          </div>
          <textarea
            readOnly
            rows={7}
            value={output}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-700
                       bg-slate-50 resize-none focus:outline-none font-mono leading-relaxed"
          />
        </div>
      )}
    </div>
  );
}

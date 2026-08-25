"use client";
import { useState } from "react";
import { Copy, Check, Download } from "lucide-react";

export default function HtmlMarkdownConverter() {
  const [input, setInput]   = useState("# Hello World\n\nThis is **bold** and *italic* text.\n\n- Item 1\n- Item 2\n\n[Link](https://example.com)");
  const [output, setOutput] = useState("");
  const [mode, setMode]     = useState<"md2html" | "html2md">("md2html");
  const [error, setError]   = useState("");
  const [copied, setCopied] = useState(false);

  const run = async () => {
    setError(""); setOutput("");
    try {
      if (mode === "md2html") {
        const { marked } = await import("marked");
        setOutput(String(await marked(input)));
      } else {
        const TurndownService = (await import("turndown")).default;
        const td = new TurndownService({ headingStyle: "atx", bulletListMarker: "-" });
        setOutput(td.turndown(input));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversion failed.");
    }
  };

  const copy = async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1800); };
  const download = () => {
    const ext = mode === "md2html" ? "html" : "md";
    const blob = new Blob([output], { type: "text/plain" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `output.${ext}`; a.click();
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex gap-2">
        {([["md2html","Markdown → HTML"],["html2md","HTML → Markdown"]] as const).map(([m,l]) => (
          <button key={m} onClick={() => { setMode(m); setOutput(""); setError(""); }}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
              mode === m ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"
            }`}>{l}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[
          [mode === "md2html" ? "Markdown Input" : "HTML Input", input, (v: string) => { setInput(v); setOutput(""); }],
          [mode === "md2html" ? "HTML Output" : "Markdown Output", output, null],
        ].map(([label, val, setter], idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">{label as string}</label>
              {idx === 1 && output && (
                <div className="flex gap-2">
                  <button onClick={copy} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-700 transition-colors">
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}{copied ? "Copied!" : "Copy"}
                  </button>
                  <button onClick={download} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-colors">
                    <Download className="w-3.5 h-3.5" />DL
                  </button>
                </div>
              )}
            </div>
            <textarea rows={12} value={val as string}
              onChange={setter ? e => (setter as (v: string) => void)(e.target.value) : undefined}
              readOnly={!setter}
              className={`w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-mono text-slate-700 resize-none focus:outline-none ${setter ? "bg-white focus:ring-2 focus:ring-indigo-500" : "bg-slate-50"}`} />
          </div>
        ))}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button onClick={run} disabled={!input.trim()}
        className="w-full py-3.5 rounded-2xl font-semibold text-white text-sm
                   bg-gradient-to-r from-slate-900 via-indigo-700 to-indigo-600
                   hover:-translate-y-0.5 disabled:opacity-50 shadow-[0_4px_20px_rgba(79,70,229,0.35)] transition-all">
        Convert
      </button>
    </div>
  );
}

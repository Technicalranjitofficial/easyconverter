"use client";
import { useState, useCallback } from "react";
import { FileText, Download, Copy, Check, Loader2 } from "lucide-react";
import { triggerDownload } from "@/lib/utils/downloadUtils";

export default function DocxToTxt() {
  const [text, setText]     = useState("");
  const [fileName, setFileName] = useState("");
  const [loading, setLoading]   = useState(false);
  const [copied, setCopied]     = useState(false);
  const [error, setError]       = useState("");

  const handleFile = useCallback(async (file: File) => {
    setLoading(true); setError(""); setText("");
    try {
      const { renderAsync } = await import("docx-preview");
      const buf = await file.arrayBuffer();
      const container = document.createElement("div");
      container.style.cssText = "position:fixed;top:-9999px;left:-9999px;visibility:hidden;";
      document.body.appendChild(container);
      await renderAsync(buf, container, undefined, { inWrapper: false, ignoreWidth: true, ignoreFonts: true, breakPages: false, useBase64URL: false, renderHeaders: false, renderFooters: false, renderFootnotes: false, renderEndnotes: false });
      const extracted = container.innerText || container.textContent || "";
      document.body.removeChild(container);
      setText(extracted.trim());
      setFileName(file.name.replace(/\.docx?$/i, ".txt"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to extract text.");
    } finally {
      setLoading(false);
    }
  }, []);

  const copy = async () => { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1800); };
  const download = () => { triggerDownload(new Blob([text], { type: "text/plain" }), fileName || "output.txt"); };

  return (
    <div className="w-full space-y-5">
      <label onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }} onDragOver={e => e.preventDefault()}
        className="flex flex-col items-center justify-center w-full min-h-[180px] rounded-2xl border-2
                   border-dashed border-slate-300 cursor-pointer bg-gradient-to-b from-slate-50 to-white
                   hover:border-indigo-400 hover:bg-indigo-50/30 transition-all">
        <input type="file" accept=".docx,.doc" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} className="sr-only" />
        <div className="flex flex-col items-center gap-3 p-6 pointer-events-none">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
            <FileText className="w-6 h-6 text-blue-500" />
          </div>
          <p className="text-sm font-semibold text-slate-700">Drop DOCX file here or click to browse</p>
          <p className="text-xs text-slate-400">.docx, .doc · Max 20 MB</p>
        </div>
      </label>
      {loading && <div className="flex items-center justify-center py-6 gap-2 text-sm text-slate-500"><Loader2 className="w-5 h-5 animate-spin text-indigo-500" />Extracting text…</div>}
      {error   && <p className="text-sm text-red-500">{error}</p>}
      {text && (
        <div className="space-y-2 animate-fade-in">
          <div className="flex justify-between">
            <span className="text-xs text-slate-400">{text.split(/\s+/).length} words</span>
            <div className="flex gap-2">
              <button onClick={copy} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-700 transition-colors">
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}{copied ? "Copied!" : "Copy Text"}
              </button>
              <button onClick={download} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-colors">
                <Download className="w-3.5 h-3.5" />Download .txt
              </button>
            </div>
          </div>
          <textarea readOnly rows={14} value={text}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-700 bg-slate-50 resize-none focus:outline-none" />
        </div>
      )}
    </div>
  );
}

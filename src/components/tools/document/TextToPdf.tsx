"use client";
import { useState } from "react";
import { Loader2, Download, FileText } from "lucide-react";
import { triggerDownload } from "@/lib/utils/downloadUtils";

export default function TextToPdf() {
  const [text, setText]     = useState("This is sample text.\n\nAdd your content here and click Convert to PDF.");
  const [loading, setLoading] = useState(false);
  const [fontSize, setFontSize] = useState(12);
  const [lineHeight, setLineHeight] = useState(1.6);
  const [margin, setMargin] = useState(20);

  const convert = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const { default: jsPDF } = await import("jspdf");
      const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
      const pageW  = 210, pageH = 297;
      const contentW = pageW - margin * 2;
      pdf.setFontSize(fontSize);
      const lineH_mm = fontSize * 0.352778 * lineHeight;
      const lines = pdf.splitTextToSize(text, contentW);
      let y = margin + lineH_mm;
      for (const line of lines) {
        if (y + lineH_mm > pageH - margin) { pdf.addPage(); y = margin + lineH_mm; }
        pdf.text(line, margin, y);
        y += lineH_mm;
      }
      triggerDownload(pdf.output("blob"), "text.pdf");
    } catch (e) {
      alert("Conversion failed: " + (e instanceof Error ? e.message : "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-5">
      <textarea rows={8} value={text} onChange={e => setText(e.target.value)}
        placeholder="Type or paste your text here…"
        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-700 bg-white
                   placeholder-slate-300 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed" />
      <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
        <div className="px-4 py-2.5 bg-slate-900 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">PDF Settings</span>
        </div>
        <div className="p-4 bg-white grid grid-cols-3 gap-4">
          {[
            { label: "Font Size (pt)", value: fontSize, setter: setFontSize, min: 8, max: 24, step: 1 },
            { label: "Line Height",    value: lineHeight, setter: setLineHeight, min: 1, max: 3, step: 0.1 },
            { label: "Margin (mm)",    value: margin, setter: setMargin, min: 5, max: 40, step: 5 },
          ].map(f => (
            <div key={f.label} className="space-y-1.5">
              <div className="flex justify-between">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">{f.label}</label>
                <span className="text-xs font-mono font-semibold text-indigo-600">{f.value}</span>
              </div>
              <input type="range" min={f.min} max={f.max} step={f.step} value={f.value}
                onChange={e => f.setter(Number(e.target.value))}
                className="w-full accent-indigo-500 h-2 rounded-full cursor-pointer" />
            </div>
          ))}
        </div>
      </div>
      <button onClick={convert} disabled={loading || !text.trim()}
        className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-semibold text-white text-sm
                   bg-gradient-to-r from-slate-900 via-indigo-700 to-indigo-600
                   hover:-translate-y-0.5 disabled:opacity-50 shadow-[0_4px_20px_rgba(79,70,229,0.35)] transition-all">
        {loading ? <><Loader2 className="w-5 h-5 animate-spin" />Generating PDF…</> : <><Download className="w-5 h-5" />Convert to PDF</>}
      </button>
    </div>
  );
}

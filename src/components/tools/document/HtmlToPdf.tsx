"use client";
import { useState, useRef } from "react";
import { Printer, Download, Eye, RotateCcw } from "lucide-react";

const PRINT_CSS = `
  @page { size: A4; margin: 18mm 20mm; }
  body { font-family: Arial, sans-serif; font-size: 12pt; line-height: 1.6; color: #000; background: #fff; margin: 0; }
  @media print { * { box-shadow: none !important; } }
`;

const SAMPLE = `<h1>Hello World</h1>
<p>This is a sample HTML document. Edit the HTML on the left and click <strong>Print to PDF</strong> to save it as a PDF file.</p>
<h2>Features</h2>
<ul>
  <li>Paste any HTML content</li>
  <li>Live preview on the right</li>
  <li>Print to PDF using your browser</li>
</ul>
<table border="1" cellpadding="8" style="border-collapse:collapse;width:100%">
  <tr style="background:#f5f5f5"><th>Name</th><th>Value</th></tr>
  <tr><td>Item 1</td><td>100</td></tr>
  <tr><td>Item 2</td><td>200</td></tr>
</table>`;

export default function HtmlToPdf() {
  const [html, setHtml]     = useState(SAMPLE);
  const [printing, setPrinting] = useState(false);

  const handlePrint = () => {
    setPrinting(true);
    const iframe = document.createElement("iframe");
    iframe.style.cssText = "position:fixed;top:-9999px;left:-9999px;width:210mm;height:297mm;border:none;visibility:hidden;";
    document.body.appendChild(iframe);
    const iDoc = iframe.contentDocument!;
    iDoc.open();
    iDoc.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><style>${PRINT_CSS}</style></head><body>${html}</body></html>`);
    iDoc.close();
    const doPrint = () => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => { document.body.contains(iframe) && document.body.removeChild(iframe); setPrinting(false); }, 1500);
    };
    iDoc.readyState === "complete" ? setTimeout(doPrint, 300) : (iframe.onload = () => setTimeout(doPrint, 300));
    setTimeout(() => { document.body.contains(iframe) && doPrint(); }, 2500);
  };

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500">HTML Input</label>
          <textarea rows={16} value={html} onChange={e => setHtml(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-mono text-slate-700 bg-white resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Eye className="w-3.5 h-3.5 text-slate-400" />
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Preview</label>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 min-h-[20rem] max-h-[26rem] overflow-auto text-sm"
            dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>
      <div className="flex items-start gap-2.5 p-3 bg-amber-50 rounded-xl border border-amber-200">
        <Printer className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700">Click <strong>Print to PDF</strong>. In the dialog, set destination to <strong>"Save as PDF"</strong> and margins to <strong>None</strong>.</p>
      </div>
      <button onClick={handlePrint} disabled={printing || !html.trim()}
        className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-semibold text-white text-sm
                   bg-gradient-to-r from-slate-900 via-indigo-700 to-indigo-600
                   hover:-translate-y-0.5 disabled:opacity-50 shadow-[0_4px_20px_rgba(79,70,229,0.35)] transition-all">
        {printing ? "Opening print dialog…" : <><Printer className="w-5 h-5" />Print to PDF</>}
      </button>
    </div>
  );
}

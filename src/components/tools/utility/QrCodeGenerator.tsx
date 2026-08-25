"use client";
import { useState, useEffect, useRef } from "react";
import { Download, QrCode, RefreshCw } from "lucide-react";

export default function QrCodeGenerator() {
  const [text, setText]     = useState("https://easyconverter.io");
  const [size, setSize]     = useState(256);
  const [fg, setFg]         = useState("#000000");
  const [bg, setBg]         = useState("#ffffff");
  const [dataUrl, setDataUrl] = useState("");
  const [error, setError]   = useState("");

  const generate = async () => {
    if (!text.trim()) return;
    try {
      setError("");
      const QRCode = (await import("qrcode")).default;
      const url = await QRCode.toDataURL(text, {
        width: size,
        color: { dark: fg, light: bg },
        errorCorrectionLevel: "H",
      });
      setDataUrl(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate QR code.");
    }
  };

  useEffect(() => { generate(); }, []);

  const download = () => {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "qrcode.png";
    a.click();
  };

  return (
    <div className="w-full space-y-5">
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Text or URL</label>
        <textarea rows={3} value={text} onChange={e => setText(e.target.value)}
          placeholder="Enter text or URL…"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-700
                     bg-white placeholder-slate-300 resize-none focus:outline-none
                     focus:ring-2 focus:ring-indigo-500 transition-all" />
      </div>
      <div className="flex flex-wrap gap-5">
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Size (px)</label>
          <input type="number" min={64} max={1024} step={32} value={size}
            onChange={e => setSize(Number(e.target.value))}
            className="w-28 px-3 py-2 rounded-xl border border-slate-200 text-sm text-center
                       focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Foreground</label>
          <div className="flex items-center gap-2">
            <input type="color" value={fg} onChange={e => setFg(e.target.value)}
              className="w-10 h-10 rounded-xl border-2 border-slate-200 cursor-pointer p-0.5 bg-white" />
            <span className="text-xs font-mono text-slate-600">{fg.toUpperCase()}</span>
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Background</label>
          <div className="flex items-center gap-2">
            <input type="color" value={bg} onChange={e => setBg(e.target.value)}
              className="w-10 h-10 rounded-xl border-2 border-slate-200 cursor-pointer p-0.5 bg-white" />
            <span className="text-xs font-mono text-slate-600">{bg.toUpperCase()}</span>
          </div>
        </div>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex gap-3">
        <button onClick={generate} disabled={!text.trim()}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-white text-sm
                     bg-gradient-to-r from-slate-900 via-indigo-700 to-indigo-600
                     hover:-translate-y-0.5 disabled:opacity-50 shadow-[0_4px_20px_rgba(79,70,229,0.35)] transition-all">
          <RefreshCw className="w-4 h-4" />Generate
        </button>
        {dataUrl && (
          <button onClick={download}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm
                       bg-white border border-slate-200 text-slate-700 hover:border-slate-300 transition-all">
            <Download className="w-4 h-4" />Download PNG
          </button>
        )}
      </div>
      {dataUrl && (
        <div className="flex justify-center p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={dataUrl} alt="QR Code" style={{ imageRendering: "pixelated", width: Math.min(size, 300) }} />
        </div>
      )}
    </div>
  );
}

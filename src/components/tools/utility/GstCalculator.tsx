"use client";
import { useState } from "react";

const GST_RATES = [0, 0.25, 3, 5, 12, 18, 28];

export default function GstCalculator() {
  const [amount, setAmount]   = useState(1000);
  const [rate, setRate]       = useState(18);
  const [mode, setMode]       = useState<"exclusive" | "inclusive">("exclusive");

  let base = 0, gst = 0, total = 0;
  if (mode === "exclusive") { base = amount; gst = amount * rate / 100; total = amount + gst; }
  else                      { base = amount / (1 + rate / 100); gst = amount - base; total = amount; }

  const cgst = gst / 2, sgst = gst / 2;
  const fmt = (n: number) => n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="w-full space-y-5">
      <div className="flex gap-2">
        {(["exclusive", "inclusive"] as const).map(m => (
          <button key={m} onClick={() => setMode(m)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
              mode === m ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"
            }`}>
            {m === "exclusive" ? "Add GST (excl.)" : "Remove GST (incl.)"}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
            Amount (₹) — {mode === "exclusive" ? "excl. GST" : "incl. GST"}
          </label>
          <input type="number" min={0} value={amount} onChange={e => setAmount(Number(e.target.value))}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-lg font-semibold
                       text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500">GST Rate (%)</label>
          <div className="flex flex-wrap gap-1.5">
            {GST_RATES.map(r => (
              <button key={r} onClick={() => setRate(r)}
                className={`px-3 py-2 rounded-xl text-sm font-semibold border transition-all ${
                  rate === r ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                }`}>{r}%</button>
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
        <div className="px-4 py-2.5 bg-slate-900">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">GST Breakdown</span>
        </div>
        <div className="divide-y divide-slate-100">
          {[
            { label: "Base Amount",   value: `₹${fmt(base)}`,  accent: false },
            { label: `CGST (${rate/2}%)`,  value: `₹${fmt(cgst)}`, accent: false },
            { label: `SGST (${rate/2}%)`,  value: `₹${fmt(sgst)}`, accent: false },
            { label: "Total GST",     value: `₹${fmt(gst)}`,   accent: false },
            { label: "Total Amount",  value: `₹${fmt(total)}`, accent: true  },
          ].map(row => (
            <div key={row.label} className={`flex items-center justify-between px-4 py-3 ${row.accent ? "bg-indigo-50" : "bg-white"}`}>
              <span className="text-sm text-slate-600">{row.label}</span>
              <span className={`text-sm font-bold ${row.accent ? "text-indigo-700" : "text-slate-800"}`}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

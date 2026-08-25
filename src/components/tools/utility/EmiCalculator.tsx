"use client";
import { useState } from "react";

export default function EmiCalculator() {
  const [principal, setPrincipal] = useState(500000);
  const [rate, setRate]           = useState(8.5);
  const [tenure, setTenure]       = useState(60);
  const [tenureType, setTenureType] = useState<"months" | "years">("months");

  const months = tenureType === "years" ? tenure * 12 : tenure;
  const monthlyRate = rate / 100 / 12;
  const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
  const totalAmt = emi * months;
  const totalInt = totalAmt - principal;
  const interest_pct = (totalInt / principal) * 100;

  const fmt = (n: number) => n.toLocaleString("en-IN", { maximumFractionDigits: 2 });

  return (
    <div className="w-full space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Loan Amount (₹)", value: principal, setter: setPrincipal, min: 1000, max: 10000000, step: 1000 },
          { label: "Annual Rate (%)", value: rate, setter: setRate, min: 0.1, max: 30, step: 0.1 },
          { label: `Tenure (${tenureType})`, value: tenure, setter: setTenure, min: 1, max: tenureType === "years" ? 30 : 360, step: 1 },
        ].map(f => (
          <div key={f.label} className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">{f.label}</label>
              <span className="text-xs font-mono font-semibold text-indigo-600">{f.label.includes("Rate") ? f.value + "%" : f.label.includes("Amount") ? "₹" + fmt(f.value) : f.value}</span>
            </div>
            <input type="range" min={f.min} max={f.max} step={f.step} value={f.value}
              onChange={e => f.setter(Number(e.target.value))}
              className="w-full accent-indigo-500 h-2 rounded-full cursor-pointer" />
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        {(["months", "years"] as const).map(t => (
          <button key={t} onClick={() => { setTenureType(t); setTenure(t === "months" ? 60 : 5); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              tenureType === t ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200"
            }`}>{t === "months" ? "Months" : "Years"}</button>
        ))}
      </div>
      {!isNaN(emi) && isFinite(emi) && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Monthly EMI",    value: `₹${fmt(emi)}`,       accent: true },
            { label: "Total Interest", value: `₹${fmt(totalInt)}`,  accent: false },
            { label: "Total Amount",   value: `₹${fmt(totalAmt)}`,  accent: false },
          ].map(s => (
            <div key={s.label} className={`p-4 rounded-2xl border ${s.accent ? "border-indigo-200 bg-indigo-50" : "border-slate-200 bg-white"} text-center shadow-sm`}>
              <p className={`text-xl font-black ${s.accent ? "text-indigo-700" : "text-slate-800"}`}>{s.value}</p>
              <p className="text-xs text-slate-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      )}
      {!isNaN(emi) && isFinite(emi) && (
        <div className="h-4 rounded-full overflow-hidden bg-slate-100 flex">
          <div className="bg-indigo-500 h-full transition-all duration-500" style={{ width: `${100 - interest_pct}%` }} />
          <div className="bg-amber-400 h-full flex-1" />
        </div>
      )}
      <div className="flex gap-4 text-xs">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-indigo-500" />Principal ({fmt(100 - interest_pct)}%)</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-400" />Interest ({fmt(interest_pct)}%)</span>
      </div>
    </div>
  );
}

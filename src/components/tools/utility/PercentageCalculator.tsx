"use client";
import { useState } from "react";

type Mode = "pct_of" | "is_what_pct" | "change" | "increase_by";
const MODES: { value: Mode; label: string }[] = [
  { value: "pct_of",       label: "% of Number"      },
  { value: "is_what_pct",  label: "What % is X of Y?" },
  { value: "change",       label: "% Change"          },
  { value: "increase_by",  label: "Increase/Decrease by %" },
];

export default function PercentageCalculator() {
  const [mode, setMode] = useState<Mode>("pct_of");
  const [a, setA] = useState(25);
  const [b, setB] = useState(200);

  let result = 0, label = "";
  if (mode === "pct_of")      { result = (a / 100) * b; label = `${a}% of ${b} = ${result.toFixed(2)}`; }
  if (mode === "is_what_pct") { result = (a / b) * 100; label = `${a} is ${result.toFixed(2)}% of ${b}`; }
  if (mode === "change")      { result = ((b - a) / Math.abs(a)) * 100; label = `Change from ${a} to ${b} = ${result > 0 ? "+" : ""}${result.toFixed(2)}%`; }
  if (mode === "increase_by") { result = a * (1 + b / 100); label = `${a} increased by ${b}% = ${result.toFixed(2)}`; }

  const aLabel = mode === "pct_of" ? "Percentage (%)" : mode === "is_what_pct" ? "Value X" : mode === "change" ? "Original Value" : "Base Value";
  const bLabel = mode === "pct_of" ? "Of Number" : mode === "is_what_pct" ? "Of Value Y" : mode === "change" ? "New Value" : "Increase/Decrease by (%)";

  return (
    <div className="w-full space-y-5">
      <div className="flex flex-wrap gap-2">
        {MODES.map(m => (
          <button key={m.value} onClick={() => setMode(m.value)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
              mode === m.value ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"
            }`}>{m.label}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[[aLabel, a, setA], [bLabel, b, setB]].map(([lbl, val, setter]) => (
          <div key={lbl as string} className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">{lbl as string}</label>
            <input type="number" value={val as number}
              onChange={e => (setter as (v: number) => void)(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-lg font-semibold
                         text-slate-800 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center p-5 rounded-2xl bg-indigo-50 border border-indigo-200">
        <p className="text-lg font-bold text-indigo-800">{label}</p>
      </div>
    </div>
  );
}

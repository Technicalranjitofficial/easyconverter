"use client";
import { useState } from "react";

function bmiCategory(bmi: number): { label: string; color: string } {
  if (bmi < 18.5) return { label: "Underweight",     color: "text-blue-600"   };
  if (bmi < 25)   return { label: "Normal weight",   color: "text-emerald-600" };
  if (bmi < 30)   return { label: "Overweight",      color: "text-amber-600"  };
  return               { label: "Obese",             color: "text-red-600"    };
}

export default function BmiCalculator() {
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(170);
  const [unit, setUnit]     = useState<"metric" | "imperial">("metric");
  const [weightLbs, setWeightLbs] = useState(154);
  const [heightFt, setHeightFt]   = useState(5);
  const [heightIn, setHeightIn]   = useState(7);

  const bmi = unit === "metric"
    ? weight / ((height / 100) ** 2)
    : (weightLbs / ((heightFt * 12 + heightIn) ** 2)) * 703;

  const { label, color } = bmiCategory(bmi);
  const idealMin = Math.round(18.5 * ((height / 100) ** 2));
  const idealMax = Math.round(24.9 * ((height / 100) ** 2));

  return (
    <div className="w-full space-y-5">
      <div className="flex gap-2">
        {(["metric", "imperial"] as const).map(u => (
          <button key={u} onClick={() => setUnit(u)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
              unit === u ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"
            }`}>
            {u === "metric" ? "Metric (kg / cm)" : "Imperial (lbs / ft)"}
          </button>
        ))}
      </div>
      {unit === "metric" ? (
        <div className="grid grid-cols-2 gap-4">
          {[["Weight (kg)", weight, setWeight, 1, 300, 1], ["Height (cm)", height, setHeight, 50, 250, 1]].map(([label, val, setter, min, max, step]) => (
            <div key={label as string} className="space-y-1.5">
              <div className="flex justify-between">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">{label as string}</label>
                <span className="text-xs font-mono font-semibold text-indigo-600">{val as number}</span>
              </div>
              <input type="range" min={min as number} max={max as number} step={step as number} value={val as number}
                onChange={e => (setter as (v: number) => void)(Number(e.target.value))}
                className="w-full accent-indigo-500 h-2 rounded-full cursor-pointer" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {[["Weight (lbs)", weightLbs, setWeightLbs, 1, 600], ["Height (ft)", heightFt, setHeightFt, 1, 8], ["+ Inches", heightIn, setHeightIn, 0, 11]].map(([label, val, setter, min, max]) => (
            <div key={label as string} className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">{label as string}</label>
              <input type="number" min={min as number} max={max as number} value={val as number}
                onChange={e => (setter as (v: number) => void)(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-center
                           focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          ))}
        </div>
      )}
      <div className="flex flex-col items-center p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <span className={`text-6xl font-black tabular-nums ${color}`}>{bmi.toFixed(1)}</span>
        <span className={`text-lg font-bold mt-2 ${color}`}>{label}</span>
        {unit === "metric" && <p className="text-xs text-slate-400 mt-2">Ideal weight: {idealMin}–{idealMax} kg for your height</p>}
      </div>
      <div className="relative h-5 rounded-full overflow-hidden bg-gradient-to-r from-blue-400 via-emerald-400 via-amber-400 to-red-500">
        <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-slate-800 rounded-full shadow transition-all duration-300"
          style={{ left: `${Math.min(100, Math.max(0, (bmi - 15) / 25 * 100))}%`, transform: "translate(-50%, -50%)" }} />
      </div>
      <div className="flex justify-between text-[10px] text-slate-400 px-1">
        <span>Underweight &lt;18.5</span><span>Normal 18.5–25</span><span>Overweight 25–30</span><span>Obese &gt;30</span>
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";

function calcAge(dob: Date, to: Date) {
  let years  = to.getFullYear()  - dob.getFullYear();
  let months = to.getMonth()     - dob.getMonth();
  let days   = to.getDate()      - dob.getDate();
  if (days < 0)   { months--; days   += new Date(to.getFullYear(), to.getMonth(), 0).getDate(); }
  if (months < 0) { years--;   months += 12; }
  const totalDays = Math.floor((to.getTime() - dob.getTime()) / 86400000);
  const totalWeeks = Math.floor(totalDays / 7);
  const totalMonths = years * 12 + months;
  const nextBday  = new Date(to.getFullYear(), dob.getMonth(), dob.getDate());
  if (nextBday <= to) nextBday.setFullYear(nextBday.getFullYear() + 1);
  const daysToNext = Math.floor((nextBday.getTime() - to.getTime()) / 86400000);
  return { years, months, days, totalDays, totalWeeks, totalMonths, daysToNext };
}

export default function AgeCalculator() {
  const [dob, setDob] = useState("1995-06-15");
  const [to, setTo]   = useState(new Date().toISOString().split("T")[0]);

  const dobDate = new Date(dob);
  const toDate  = new Date(to);
  const valid   = !isNaN(dobDate.getTime()) && !isNaN(toDate.getTime()) && dobDate < toDate;
  const r       = valid ? calcAge(dobDate, toDate) : null;

  return (
    <div className="w-full space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Date of Birth</label>
          <input type="date" value={dob} max={to} onChange={e => setDob(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700
                       focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Age On Date</label>
          <input type="date" value={to} min={dob} max={new Date().toISOString().split("T")[0]}
            onChange={e => setTo(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700
                       focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
      </div>
      {r && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-center gap-3 p-6 rounded-2xl bg-indigo-50 border border-indigo-200">
            <span className="text-5xl font-black text-indigo-700">{r.years}</span>
            <span className="text-2xl font-bold text-indigo-500">yr</span>
            <span className="text-4xl font-black text-indigo-600">{r.months}</span>
            <span className="text-xl font-bold text-indigo-400">mo</span>
            <span className="text-3xl font-black text-indigo-500">{r.days}</span>
            <span className="text-lg font-bold text-indigo-400">days</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total Days",   value: r.totalDays.toLocaleString()  },
              { label: "Total Weeks",  value: r.totalWeeks.toLocaleString() },
              { label: "Total Months", value: r.totalMonths.toLocaleString() },
              { label: "Next Birthday",value: `${r.daysToNext} days`        },
            ].map(s => (
              <div key={s.label} className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm text-center">
                <p className="text-lg font-bold text-slate-900 tabular-nums">{s.value}</p>
                <p className="text-xs text-slate-400 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

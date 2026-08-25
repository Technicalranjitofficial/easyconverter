"use client";

import { useState } from "react";
import { ArrowLeftRight, Copy, Check } from "lucide-react";

export interface UnitDef {
  label: string;       // display name e.g. "Kilometre"
  symbol: string;      // short e.g. "km"
  toBase: (v: number) => number;   // convert FROM this unit TO base unit
  fromBase: (v: number) => number; // convert FROM base unit TO this unit
}

interface UnitConverterShellProps {
  units: UnitDef[];
  defaultFrom?: number;
  defaultFromUnit?: number; // index
  defaultToUnit?: number;   // index
  precision?: number;
  description?: string;
}

export default function UnitConverterShell({
  units,
  defaultFrom = 1,
  defaultFromUnit = 0,
  defaultToUnit = 1,
  precision = 6,
  description,
}: UnitConverterShellProps) {
  const [value, setValue]     = useState(String(defaultFrom));
  const [fromIdx, setFromIdx] = useState(defaultFromUnit);
  const [toIdx, setToIdx]     = useState(defaultToUnit);
  const [copied, setCopied]   = useState(false);

  const numVal = parseFloat(value);
  const isValid = !isNaN(numVal);

  // Convert: input → base → output
  const result = isValid
    ? units[fromIdx].fromBase(units[toIdx >= 0 ? toIdx : 0] ? units[toIdx].toBase(numVal) : numVal)
    : null;

  // Actually: from → base → to
  const converted = isValid
    ? units[toIdx].fromBase(units[fromIdx].toBase(numVal))
    : null;

  const formatResult = (n: number | null) => {
    if (n === null) return "";
    // Use toPrecision for very small/large numbers
    if (Math.abs(n) > 1e10 || (Math.abs(n) < 1e-5 && n !== 0)) {
      return n.toExponential(precision);
    }
    return parseFloat(n.toPrecision(precision)).toString();
  };

  const swap = () => {
    setFromIdx(toIdx);
    setToIdx(fromIdx);
    if (converted !== null) setValue(formatResult(converted));
  };

  const copy = async () => {
    const txt = formatResult(converted);
    await navigator.clipboard.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="w-full space-y-5">
      {description && (
        <p className="text-sm text-slate-500">{description}</p>
      )}

      {/* Input row */}
      <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
        <div className="px-4 py-2.5 bg-slate-900 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">Convert</span>
        </div>
        <div className="p-4 bg-white space-y-3">
          {/* From */}
          <div className="flex gap-3">
            <input
              type="number"
              value={value}
              onChange={e => setValue(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-lg font-semibold
                         text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="0"
            />
            <select
              value={fromIdx}
              onChange={e => setFromIdx(Number(e.target.value))}
              className="w-48 px-3 py-3 rounded-xl border border-slate-200 text-sm font-medium
                         text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {units.map((u, i) => (
                <option key={u.symbol} value={i}>{u.label} ({u.symbol})</option>
              ))}
            </select>
          </div>

          {/* Swap button */}
          <div className="flex justify-center">
            <button onClick={swap}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200
                         text-slate-500 text-xs font-semibold hover:bg-indigo-50 hover:border-indigo-200
                         hover:text-indigo-600 transition-all">
              <ArrowLeftRight className="w-3.5 h-3.5" />Swap
            </button>
          </div>

          {/* To */}
          <div className="flex gap-3">
            <div className={`flex-1 px-4 py-3 rounded-xl border text-lg font-bold
                             ${converted !== null ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "bg-slate-50 border-slate-200 text-slate-400"}`}>
              {converted !== null ? formatResult(converted) : "—"}
            </div>
            <select
              value={toIdx}
              onChange={e => setToIdx(Number(e.target.value))}
              className="w-48 px-3 py-3 rounded-xl border border-slate-200 text-sm font-medium
                         text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {units.map((u, i) => (
                <option key={u.symbol} value={i}>{u.label} ({u.symbol})</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Result badge + copy */}
      {converted !== null && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-indigo-50 border border-indigo-200 animate-fade-in">
          <div className="flex-1 text-sm text-indigo-700">
            <span className="font-bold text-indigo-900">{value} {units[fromIdx].symbol}</span>
            {" = "}
            <span className="font-bold text-indigo-900">{formatResult(converted)} {units[toIdx].symbol}</span>
          </div>
          <button onClick={copy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white
                       text-xs font-semibold hover:bg-indigo-500 transition-colors flex-shrink-0">
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      )}

      {/* All conversions table */}
      {isValid && (
        <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
          <div className="px-4 py-2.5 bg-slate-900">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
              All Conversions for {value} {units[fromIdx].symbol}
            </span>
          </div>
          <div className="divide-y divide-slate-100">
            {units.map((u, i) => {
              if (i === fromIdx) return null;
              const val = u.fromBase(units[fromIdx].toBase(numVal));
              return (
                <div key={u.symbol} className="flex items-center justify-between px-4 py-2.5 bg-white hover:bg-slate-50 transition-colors">
                  <span className="text-sm text-slate-600">{u.label}</span>
                  <span className="text-sm font-semibold text-slate-800 font-mono">
                    {formatResult(val)} <span className="text-slate-400 font-normal">{u.symbol}</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

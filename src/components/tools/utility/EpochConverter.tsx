"use client";
import { useState } from "react";
import { Copy, Check, Clock } from "lucide-react";

export default function EpochConverter() {
  const [epoch, setEpoch]   = useState(String(Math.floor(Date.now() / 1000)));
  const [dateStr, setDateStr] = useState(() => new Date().toISOString().slice(0, 19));
  const [copied, setCopied] = useState<string | null>(null);

  const epochToDate = () => {
    const n = Number(epoch);
    if (isNaN(n)) return "Invalid timestamp";
    const ms = epoch.length > 10 ? n : n * 1000;
    return new Date(ms).toISOString();
  };

  const dateToEpoch = () => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "Invalid date";
    return String(Math.floor(d.getTime() / 1000));
  };

  const copy = async (key: string, val: string) => {
    await navigator.clipboard.writeText(val);
    setCopied(key); setTimeout(() => setCopied(null), 1800);
  };

  const nowEpoch = Math.floor(Date.now() / 1000);

  const rows = [
    { label: "Local time",      value: new Date(Number(epoch.length > 10 ? epoch : Number(epoch) * 1000)).toLocaleString() },
    { label: "UTC",             value: epochToDate() },
    { label: "Relative",        value: `${Math.abs(nowEpoch - Number(epoch))} seconds ${Number(epoch) < nowEpoch ? "ago" : "from now"}` },
  ];

  return (
    <div className="w-full space-y-5">
      {/* Epoch → Date */}
      <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
        <div className="px-4 py-2.5 bg-slate-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">Unix Timestamp → Date</span>
          <button onClick={() => setEpoch(String(Date.now()))} className="ml-auto text-xs text-indigo-400 hover:text-indigo-300 transition-colors">Use now (ms)</button>
        </div>
        <div className="p-4 bg-white space-y-3">
          <input value={epoch} onChange={e => setEpoch(e.target.value)}
            placeholder="Unix timestamp (seconds or ms)…"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono
                       text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <div className="divide-y divide-slate-100">
            {rows.map(row => (
              <div key={row.label} className="flex items-center justify-between py-2.5">
                <span className="text-xs font-semibold text-slate-400 w-24">{row.label}</span>
                <span className="text-sm font-mono text-slate-700 flex-1 px-3">{row.value}</span>
                <button onClick={() => copy(row.label, row.value)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors">
                  {copied === row.label ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Date → Epoch */}
      <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
        <div className="px-4 py-2.5 bg-slate-900">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">Date / Time → Unix Timestamp</span>
        </div>
        <div className="p-4 bg-white space-y-3">
          <input type="datetime-local" value={dateStr} onChange={e => setDateStr(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700
                       focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-indigo-50 border border-indigo-100">
            <span className="text-sm font-mono font-bold text-indigo-800">{dateToEpoch()}</span>
            <button onClick={() => copy("epoch-result", dateToEpoch())}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-colors">
              {copied === "epoch-result" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

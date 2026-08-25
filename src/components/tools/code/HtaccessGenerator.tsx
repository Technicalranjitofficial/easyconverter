"use client";
import { useState } from "react";
import { generateHtaccess } from "@/lib/converters/codeConverter";
import { Copy, Check, Download } from "lucide-react";

const RULES = [
  { key:"https",    label:"Force HTTPS",            desc:"Redirect all HTTP to HTTPS" },
  { key:"www",      label:"Force www",              desc:"Redirect non-www to www" },
  { key:"cache",    label:"Browser Caching",        desc:"Set cache headers for assets" },
  { key:"gzip",     label:"Enable Gzip Compression",desc:"Compress HTML, CSS and JS" },
  { key:"redirect", label:"SPA Routing",            desc:"Redirect all routes to index.html" },
];

export default function HtaccessGenerator() {
  const [rules, setRules] = useState({ redirect:false, www:false, https:true, cache:true, gzip:true });
  const [copied, setCopied] = useState(false);

  const output = generateHtaccess(rules);
  const toggle = (key: string) => setRules(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  const copy = async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1800); };
  const download = () => { const b=new Blob([output],{type:"text/plain"}); const a=document.createElement("a"); a.href=URL.createObjectURL(b); a.download=".htaccess"; a.click(); };

  return (
    <div className="w-full space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {RULES.map(r => (
          <label key={r.key} className={`flex items-start gap-3 p-3.5 rounded-xl cursor-pointer border transition-all ${
            rules[r.key as keyof typeof rules] ? "bg-indigo-50 border-indigo-200" : "bg-slate-50 border-slate-200 hover:border-slate-300"
          }`}>
            <input type="checkbox" checked={rules[r.key as keyof typeof rules]} onChange={() => toggle(r.key)} className="accent-indigo-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-slate-800">{r.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{r.desc}</p>
            </div>
          </label>
        ))}
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500">.htaccess</label>
          <div className="flex gap-2">
            <button onClick={copy} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-700 transition-colors">
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}Copy
            </button>
            <button onClick={download} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-colors">
              <Download className="w-3.5 h-3.5" />Download
            </button>
          </div>
        </div>
        <textarea readOnly rows={14} value={output}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-mono text-slate-700 bg-slate-50 resize-none" />
      </div>
    </div>
  );
}

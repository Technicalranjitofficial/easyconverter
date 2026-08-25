"use client";
import { useState } from "react";
import { generateRobotsTxt } from "@/lib/converters/codeConverter";
import { Copy, Check, Download } from "lucide-react";

export default function RobotsTxtGenerator() {
  const [allow,    setAllow]    = useState("/");
  const [disallow, setDisallow] = useState("/admin/\n/private/");
  const [sitemap,  setSitemap]  = useState("https://example.com/sitemap.xml");
  const [agent,    setAgent]    = useState("*");
  const [copied,   setCopied]   = useState(false);

  const output = generateRobotsTxt(allow.split("\n").map(s=>s.trim()).filter(Boolean), disallow.split("\n").map(s=>s.trim()).filter(Boolean), sitemap, agent);
  const copy = async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1800); };
  const download = () => { const b = new Blob([output],{type:"text/plain"}); const a=document.createElement("a"); a.href=URL.createObjectURL(b); a.download="robots.txt"; a.click(); };

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {[["User-agent", agent, setAgent, "*"], ["Sitemap URL", sitemap, setSitemap, "https://…/sitemap.xml"]].map(([l,v,s,p])=>(
          <div key={l as string} className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">{l as string}</label>
            <input value={v as string} onChange={e=>(s as (v:string)=>void)(e.target.value)} placeholder={p as string}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[["Allow (one per line)", allow, setAllow], ["Disallow (one per line)", disallow, setDisallow]].map(([l,v,s])=>(
          <div key={l as string} className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">{l as string}</label>
            <textarea rows={4} value={v as string} onChange={e=>(s as (v:string)=>void)(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-mono text-slate-700 bg-white resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500">robots.txt</label>
          <div className="flex gap-2">
            <button onClick={copy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-700 transition-colors">
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}Copy
            </button>
            <button onClick={download}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-colors">
              <Download className="w-3.5 h-3.5" />Download
            </button>
          </div>
        </div>
        <textarea readOnly rows={8} value={output}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-mono text-slate-700 bg-slate-50 resize-none" />
      </div>
    </div>
  );
}

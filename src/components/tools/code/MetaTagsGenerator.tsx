"use client";
import { useState } from "react";
import { generateMetaTags } from "@/lib/converters/codeConverter";
import { Copy, Check, Code } from "lucide-react";

export default function MetaTagsGenerator() {
  const [title,  setTitle]  = useState("My Awesome Page");
  const [desc,   setDesc]   = useState("A description of my page for search engines.");
  const [url,    setUrl]    = useState("https://example.com");
  const [image,  setImage]  = useState("https://example.com/og-image.png");
  const [copied, setCopied] = useState(false);

  const output = generateMetaTags(title, desc, url, image);
  const copy   = async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1800); };

  return (
    <div className="w-full space-y-4">
      {[
        ["Title",       title,  setTitle,  "My Awesome Page"],
        ["Description", desc,   setDesc,   "A description for search engines…"],
        ["Page URL",    url,    setUrl,    "https://example.com"],
        ["OG Image URL",image,  setImage,  "https://example.com/og-image.png"],
      ].map(([label, val, setter, ph]) => (
        <div key={label as string} className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500">{label as string}</label>
          <input value={val as string} onChange={e => (setter as (v: string) => void)(e.target.value)}
            placeholder={ph as string}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700
                       focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
      ))}
      <div className="space-y-1.5">
        <div className="flex justify-between">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Generated Tags</label>
          <button onClick={copy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-700 transition-colors">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Copy HTML"}
          </button>
        </div>
        <textarea readOnly rows={14} value={output}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-mono text-slate-700 bg-slate-50 resize-none" />
      </div>
    </div>
  );
}

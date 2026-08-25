"use client";
import { useState, useEffect, useRef } from "react";
import { Copy, Check } from "lucide-react";

const SAMPLE = `# Markdown Preview

Type your **markdown** here and see a *live preview* on the right.

## Features
- **Bold**, *italic*, \`code\`
- [Links](https://example.com)
- Tables, blockquotes and more

> This is a blockquote.

\`\`\`js
const hello = "world";
console.log(hello);
\`\`\`

| Column 1 | Column 2 |
|----------|----------|
| Cell A   | Cell B   |
`;

export default function MarkdownPreview() {
  const [md, setMd]         = useState(SAMPLE);
  const [html, setHtml]     = useState("");
  const [copied, setCopied] = useState(false);
  const previewRef          = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const { marked } = await import("marked");
      setHtml(await marked(md));
    })();
  }, [md]);

  const copyMd = async () => {
    await navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="w-full space-y-3">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Editor */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Markdown</label>
            <button onClick={copyMd}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-700 transition-colors">
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied!" : "Copy MD"}
            </button>
          </div>
          <textarea rows={20} value={md} onChange={e => setMd(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-mono
                       text-slate-700 bg-white resize-none focus:outline-none
                       focus:ring-2 focus:ring-indigo-500 transition-all leading-relaxed" />
        </div>
        {/* Preview */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Preview</label>
          <div
            ref={previewRef}
            className="w-full min-h-[20rem] p-5 rounded-xl border border-slate-200 bg-white text-sm
                       prose prose-slate max-w-none overflow-auto"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </div>
  );
}

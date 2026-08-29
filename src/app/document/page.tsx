import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileOutput, CheckCircle2 } from "lucide-react";
import { documentTools } from "@/config/tools";

export const metadata: Metadata = {
  title: "Free Online Document Tools – HTML to PDF, Text to PDF, Markdown | EasyConverter.io",
  description: "6 free document tools: HTML to PDF, text to PDF, HTML↔Markdown converter, PDF page counter, DOCX to TXT, image flip & rotate.",
  alternates: { canonical: "https://www.easyconverter.io/document" },
};

export default function DocumentToolsPage() {
  return (
    <div className="bg-gradient-to-b from-slate-50/80 to-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="mb-2 text-xs font-bold uppercase tracking-widest text-rose-500">Document Tools</div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">Free Online Document Tools</h1>
        <p className="text-[1.0625rem] text-slate-500 max-w-2xl leading-relaxed mb-12">
          Convert between HTML, PDF, Markdown and text formats — all running 100% in your browser.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {documentTools.map((tool) => (
            <Link key={tool.id} href={tool.slug}
              className="group flex flex-col gap-3 p-5 rounded-2xl bg-white border border-slate-200
                         hover:border-rose-200 hover:shadow-lg hover:shadow-rose-500/5 hover:-translate-y-0.5 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <FileOutput className="w-5 h-5 text-rose-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-800 text-sm group-hover:text-rose-700 transition-colors">{tool.headline}</p>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">{tool.description}</p>
              </div>
              <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100">
                <span className="text-xs text-emerald-600 font-medium flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />Free</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-rose-500 group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

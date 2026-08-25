import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Type, CheckCircle2 } from "lucide-react";
import { textTools } from "@/config/tools";

export const metadata: Metadata = {
  title: "Free Online Text Tools – Word Counter, Case Converter, Lorem Ipsum | EasyConverter.io",
  description: "13 free online text tools. Word counter, case converter, Lorem ipsum generator, find & replace, diff checker, readability score, markdown preview and more. No upload.",
  alternates: { canonical: "https://easyconverter.io/text" },
};

export default function TextToolsPage() {
  return (
    <div className="bg-gradient-to-b from-slate-50/80 to-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="mb-2 text-xs font-bold uppercase tracking-widest text-indigo-500">Text Tools</div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
          Free Online Text Tools
        </h1>
        <p className="text-[1.0625rem] text-slate-500 max-w-2xl leading-relaxed mb-12">
          Word counters, case converters, text utilities — all running 100% in your browser. No upload, no sign-up.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {textTools.map((tool, i) => (
            <Link key={tool.id} href={tool.slug}
              className="group flex flex-col gap-3 p-5 rounded-2xl bg-white border border-slate-200
                         hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5
                         hover:-translate-y-0.5 transition-all duration-300"
              style={{ animationDelay: `${i * 40}ms` }}>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110">
                <Type className="w-5 h-5 text-indigo-500" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-800 text-sm group-hover:text-indigo-700 transition-colors">
                  {tool.headline}
                </p>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">{tool.description}</p>
              </div>
              <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100">
                <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />Free
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Database, CheckCircle2 } from "lucide-react";
import { dataTools } from "@/config/tools";

export const metadata: Metadata = {
  title: "Free Online Data Tools – JSON, CSV, XML, YAML Converters | EasyConverter.io",
  description: "14 free data conversion tools: JSON formatter, CSV↔JSON, JSON↔XML, YAML, TSV, Excel to JSON, TypeScript generator, JSON diff, table view and more.",
  alternates: { canonical: "https://www.easyconverter.io/data" },
};

export default function DataToolsPage() {
  return (
    <div className="bg-gradient-to-b from-slate-50/80 to-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="mb-2 text-xs font-bold uppercase tracking-widest text-sky-500">Data Tools</div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">Free Online Data Converters</h1>
        <p className="text-[1.0625rem] text-slate-500 max-w-2xl leading-relaxed mb-12">
          JSON, CSV, XML, YAML, SQL and more — all running 100% in your browser. No upload, no account.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {dataTools.map((tool) => (
            <Link key={tool.id} href={tool.slug}
              className="group flex flex-col gap-3 p-5 rounded-2xl bg-white border border-slate-200
                         hover:border-sky-200 hover:shadow-lg hover:shadow-sky-500/5 hover:-translate-y-0.5 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Database className="w-5 h-5 text-sky-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-800 text-sm group-hover:text-sky-700 transition-colors">{tool.headline}</p>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">{tool.description}</p>
              </div>
              <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100">
                <span className="text-xs text-emerald-600 font-medium flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />Free</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-sky-500 group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

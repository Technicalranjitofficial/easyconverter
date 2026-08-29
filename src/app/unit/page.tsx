import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Scale, CheckCircle2 } from "lucide-react";
import { unitTools } from "@/config/tools";

export const metadata: Metadata = {
  title: "Free Online Unit Converter Tools – Length, Weight, Temperature | EasyConverter.io",
  description: "15 free online unit converter tools. Length, weight, temperature, speed, data storage, area, volume, time, fuel economy, pressure, energy, power, frequency, angle and resolution.",
  alternates: { canonical: "https://www.easyconverter.io/unit" },
};

export default function UnitToolsPage() {
  return (
    <div className="bg-gradient-to-b from-slate-50/80 to-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="mb-2 text-xs font-bold uppercase tracking-widest text-emerald-500">Unit Converters</div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
          Free Online Unit Converters
        </h1>
        <p className="text-[1.0625rem] text-slate-500 max-w-2xl leading-relaxed mb-12">
          Convert between any units instantly — all conversions run locally in your browser. No upload, no sign-up.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {unitTools.map((tool, i) => (
            <Link key={tool.id} href={tool.slug}
              className="group flex flex-col gap-3 p-5 rounded-2xl bg-white border border-slate-200
                         hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/5
                         hover:-translate-y-0.5 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Scale className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-800 text-sm group-hover:text-emerald-700 transition-colors">
                  {tool.headline}
                </p>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">{tool.description}</p>
              </div>
              <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100">
                <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />Free
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

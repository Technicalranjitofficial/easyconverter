import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Wrench, CheckCircle2 } from "lucide-react";
import { utilityTools } from "@/config/tools";

export const metadata: Metadata = {
  title: "Free Online Utility Tools – QR Code, Password, Hash, Calculator | EasyConverter.io",
  description: "14 free online utility tools: QR code generator, password generator, UUID, Base64, URL encoder, hash generator, regex tester, BMI, EMI, age, GST, percentage calculators.",
  alternates: { canonical: "https://easyconverter.io/utilities" },
};

export default function UtilityToolsPage() {
  return (
    <div className="bg-gradient-to-b from-slate-50/80 to-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="mb-2 text-xs font-bold uppercase tracking-widest text-amber-500">Utilities</div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
          Free Online Utility Tools
        </h1>
        <p className="text-[1.0625rem] text-slate-500 max-w-2xl leading-relaxed mb-12">
          QR generators, calculators, hash tools, password generators and more — all running in your browser. No upload.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {utilityTools.map((tool, i) => (
            <Link key={tool.id} href={tool.slug}
              className="group flex flex-col gap-3 p-5 rounded-2xl bg-white border border-slate-200
                         hover:border-amber-200 hover:shadow-lg hover:shadow-amber-500/5
                         hover:-translate-y-0.5 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Wrench className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-800 text-sm group-hover:text-amber-700 transition-colors">
                  {tool.headline}
                </p>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">{tool.description}</p>
              </div>
              <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100">
                <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />Free
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

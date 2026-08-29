import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Code2, CheckCircle2 } from "lucide-react";
import { codeTools } from "@/config/tools";

export const metadata: Metadata = {
  title: "Free Online Developer Tools – HTML, CSS, JS, SQL Formatters | EasyConverter.io",
  description: "13 free developer tools: HTML/CSS/JS formatter, HTML→JSX, SQL formatter, CSS to Tailwind, autoprefixer, color converter, meta tags generator, robots.txt, .htaccess generator.",
  alternates: { canonical: "https://www.easyconverter.io/code" },
};

export default function CodeToolsPage() {
  return (
    <div className="bg-gradient-to-b from-slate-50/80 to-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="mb-2 text-xs font-bold uppercase tracking-widest text-violet-500">Developer Tools</div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">Free Online Developer Tools</h1>
        <p className="text-[1.0625rem] text-slate-500 max-w-2xl leading-relaxed mb-12">
          Code formatters, generators and converters for HTML, CSS, JavaScript and SQL — all in your browser.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {codeTools.map((tool) => (
            <Link key={tool.id} href={tool.slug}
              className="group flex flex-col gap-3 p-5 rounded-2xl bg-white border border-slate-200
                         hover:border-violet-200 hover:shadow-lg hover:shadow-violet-500/5 hover:-translate-y-0.5 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Code2 className="w-5 h-5 text-violet-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-800 text-sm group-hover:text-violet-700 transition-colors">{tool.headline}</p>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">{tool.description}</p>
              </div>
              <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100">
                <span className="text-xs text-emerald-600 font-medium flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />Free</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-violet-500 group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

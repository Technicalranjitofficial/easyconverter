import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Image as ImageIcon, CheckCircle2, Zap } from "lucide-react";
import { imageTools } from "@/config/tools";
import { imagePageMetadata } from "@/lib/seo";

export const metadata: Metadata = imagePageMetadata;

export default function ImageToolsPage() {
  return (
    <div>
      {/* Page header */}
      <div className="bg-gradient-to-b from-slate-50/80 to-white border-b border-slate-100/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                              bg-indigo-50 border border-indigo-100
                              text-xs font-semibold text-indigo-600 mb-4">
                <ImageIcon className="w-3.5 h-3.5" />
                Image Tools
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
                Free Online Image Converter Tools
              </h1>
              <p className="text-[1.0625rem] text-slate-500 max-w-2xl leading-relaxed">
                Convert, compress, and resize images entirely in your browser.
                Files never leave your device — completely free, no account needed.
              </p>
            </div>

            <div className="flex-shrink-0 flex items-center gap-3 sm:flex-col sm:items-end">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                {imageTools.length} tools available
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Zap className="w-4 h-4 text-indigo-500" />
                All 100% free
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tools grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {imageTools.map((tool, i) => (
            <Link
              key={tool.id}
              href={tool.slug}
              className="tool-card group flex flex-col gap-4 p-6 rounded-2xl
                         bg-white border border-slate-200/80
                         hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/6
                         hover:-translate-y-1 transition-all duration-300"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                                bg-gradient-to-br from-indigo-50 to-violet-50
                                group-hover:from-indigo-100 group-hover:to-violet-100
                                transition-all duration-300 group-hover:scale-110">
                  <ImageIcon className="w-5 h-5 text-indigo-500" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 mt-1 flex-shrink-0
                                       group-hover:text-indigo-500 group-hover:translate-x-0.5
                                       transition-all duration-200" />
              </div>

              <div>
                <h2 className="font-bold text-slate-900 mb-1.5 group-hover:text-indigo-700 transition-colors">
                  {tool.title}
                </h2>
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                  {tool.description}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-slate-50">
                {["Free", "No upload", "Batch"].map((tag) => (
                  <span key={tag} className="text-xs text-slate-400 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

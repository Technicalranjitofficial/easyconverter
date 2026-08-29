import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileText, CheckCircle2 } from "lucide-react";
import { pdfTools } from "@/config/tools";

export const metadata: Metadata = {
  title: "Free Online PDF Tools – Merge, Split, Compress, Rotate | EasyConverter.io",
  description:
    "Free online PDF tools. Merge PDFs, split PDF, compress PDF, rotate pages, convert PDF to JPG/PNG, add watermarks and page numbers. No upload — 100% browser-based.",
  keywords: "merge pdf, split pdf, compress pdf, rotate pdf, pdf to jpg, pdf to png, pdf tools online free",
  alternates: { canonical: "https://www.easyconverter.io/pdf" },
  openGraph: {
    title: "Free Online PDF Tools | EasyConverter.io",
    description: "8 free PDF tools — merge, split, compress, rotate, convert, watermark. No upload, no account.",
    url: "https://www.easyconverter.io/pdf",
    siteName: "EasyConverter.io",
    type: "website",
  },
};

export default function PdfToolsPage() {
  return (
    <div className="bg-gradient-to-b from-slate-50/80 to-white min-h-screen">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="mb-2 text-xs font-bold uppercase tracking-widest text-red-500">PDF Tools</div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
          Free Online PDF Tools
        </h1>
        <p className="text-[1.0625rem] text-slate-500 max-w-2xl leading-relaxed">
          Merge, split, compress, rotate, and convert PDF files entirely in your browser.
          No file is ever uploaded — pdf-lib and PDF.js run 100% locally.
        </p>
      </div>

      {/* Tools grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pdfTools.map((tool, i) => (
            <Link
              key={tool.id}
              href={tool.slug}
              className="group flex flex-col gap-3 p-5 rounded-2xl
                         bg-white border border-slate-200
                         hover:border-red-200 hover:shadow-lg hover:shadow-red-500/5
                         hover:-translate-y-0.5 transition-all duration-300"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0
                              transition-transform duration-300 group-hover:scale-110">
                <FileText className="w-5 h-5 text-red-500" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-800 text-sm group-hover:text-red-700 transition-colors">
                  {tool.headline}
                </p>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">{tool.description}</p>
              </div>
              <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100">
                <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Free
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-red-500 group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

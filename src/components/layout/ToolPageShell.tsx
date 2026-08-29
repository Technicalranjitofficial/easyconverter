import Link from "next/link";
import { ChevronRight, Shield, Zap, Users, Star } from "lucide-react";
import AdBanner from "@/components/ads/AdBanner";
import ToolFAQ from "@/components/seo/ToolFAQ";
import RelatedTools from "@/components/seo/RelatedTools";
import ToolSchemas from "@/components/seo/ToolSchemas";
import type { ToolConfig } from "@/config/tools";
import { getRelatedTools } from "@/config/tools";

interface ToolPageShellProps {
  tool: ToolConfig;
  children: React.ReactNode;
}

const trustItems = [
  { icon: Shield, text: "Files never uploaded" },
  { icon: Zap,    text: "Instant conversion" },
  { icon: Users,  text: "Batch up to 20 files" },
  { icon: Star,   text: "100% free" },
];

/** Maps tool.category → human label + href */
const CATEGORY_META: Record<string, { label: string; href: string }> = {
  image:     { label: "Image Tools",    href: "/image"     },
  pdf:       { label: "PDF Tools",      href: "/pdf"       },
  text:      { label: "Text Tools",     href: "/text"      },
  unit:      { label: "Unit Converters",href: "/unit"      },
  utilities: { label: "Utilities",      href: "/utilities" },
  data:      { label: "Data Tools",     href: "/data"      },
  code:      { label: "Code Tools",     href: "/code"      },
  document:  { label: "Document Tools", href: "/document"  },
};

export default function ToolPageShell({ tool, children }: ToolPageShellProps) {
  const relatedTools = getRelatedTools(tool);
  const cat = CATEGORY_META[tool.category] ?? { label: "Tools", href: "/" };

  return (
    <>
      <ToolSchemas tool={tool} />

      {/* Page header with subtle gradient */}
      <div className="bg-gradient-to-b from-slate-50/80 to-white border-b border-slate-100/80">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-10">

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb"
               className="flex items-center gap-1 text-xs text-slate-400 mb-6">
            <Link href="/" className="hover:text-indigo-500 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
            <Link href={cat.href} className="hover:text-indigo-500 transition-colors">{cat.label}</Link>
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
            <span className="text-slate-500 font-medium">{tool.title}</span>
          </nav>

          {/* Title — use headline as H1 (exact-match keyword phrasing) */}
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            {tool.headline}
          </h1>
          <p className="text-[1.0625rem] text-slate-500 leading-relaxed max-w-2xl mb-6">
            {tool.description}
          </p>

          {/* Trust pills */}
          <div className="flex flex-wrap items-center gap-2">
            {trustItems.map((item) => {
              const Icon = item.icon;
              return (
                <span
                  key={item.text}
                  className="inline-flex items-center gap-1.5 text-xs font-medium
                             px-3 py-1.5 rounded-full
                             bg-white border border-slate-200 text-slate-600
                             shadow-sm"
                >
                  <Icon className="w-3.5 h-3.5 text-indigo-500" />
                  {item.text}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

        {/* Top ad */}
        <AdBanner slot="1234567890" format="horizontal" className="mb-8 rounded-2xl overflow-hidden" />

        {/* Tool widget */}
        <div className="mb-10">{children}</div>

        {/* Below-results ad — highest CTR placement */}
        <AdBanner slot="0987654321" format="rectangle" className="mb-12 rounded-2xl overflow-hidden" />

        {/* Content */}
        <div className="space-y-12">
          {/* About */}
          <section className="tool-prose">
            <h2>About {tool.title}</h2>
            <p>{tool.longDescription}</p>

            <h2>How to {tool.actionVerb} — step by step</h2>
            <ol className="space-y-3 pl-5 text-slate-500 text-[0.9375rem]">
              {tool.howToSteps.map((step, i) => (
                <li key={i} className="leading-relaxed pl-1">{step}</li>
              ))}
            </ol>

            <h2>Why use EasyConverter.io?</h2>
            <ul className="space-y-2 pl-5 text-slate-500 text-[0.9375rem]">
              <li className="leading-relaxed">
                <strong className="text-slate-700">No upload required</strong> — files never leave your
                browser, ensuring complete privacy and security.
              </li>
              <li className="leading-relaxed">
                <strong className="text-slate-700">Free forever</strong> — no account, no limits, no hidden fees.
              </li>
              <li className="leading-relaxed">
                <strong className="text-slate-700">Instant results</strong> — conversion happens using your
                device&apos;s processor. Results in under a second.
              </li>
              <li className="leading-relaxed">
                <strong className="text-slate-700">Batch convert</strong> — process up to {tool.maxBatchSize}{" "}
                files simultaneously with a single click.
              </li>
            </ul>
          </section>

          {/* FAQ */}
          <ToolFAQ faqs={tool.faqs} />

          {/* Related tools */}
          {relatedTools.length > 0 && <RelatedTools tools={relatedTools} />}
        </div>
      </main>
    </>
  );
}

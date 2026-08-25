import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Section {
  id: string;
  heading: string;
}

interface LegalPageShellProps {
  badge: string;
  title: string;
  subtitle: string;
  lastUpdated?: string;
  sections: Section[];
  children: React.ReactNode;
}

export default function LegalPageShell({
  badge,
  title,
  subtitle,
  lastUpdated,
  sections,
  children,
}: LegalPageShellProps) {
  return (
    <div>
      {/* Page hero */}
      <div className="bg-gradient-to-b from-slate-50/80 to-white border-b border-slate-100/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1 text-xs text-slate-400 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-indigo-500 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
            <span className="text-slate-500 font-medium">{title}</span>
          </nav>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5
                          bg-indigo-50 border border-indigo-100
                          text-xs font-semibold text-indigo-600">
            {badge}
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
            {title}
          </h1>
          <p className="text-[1.0625rem] text-slate-500 max-w-2xl leading-relaxed">{subtitle}</p>

          {lastUpdated && (
            <p className="mt-4 text-xs text-slate-400">
              Last updated: <span className="font-medium text-slate-500">{lastUpdated}</span>
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-16">

          {/* Sticky sidebar TOC (desktop only) */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-1">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                On this page
              </p>
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="block px-3 py-2 rounded-lg text-sm text-slate-500
                             hover:text-indigo-600 hover:bg-indigo-50/60
                             transition-all duration-150 border-l-2 border-transparent
                             hover:border-indigo-300"
                >
                  {s.heading}
                </a>
              ))}
            </div>
          </aside>

          {/* Main content */}
          <article className="prose-legal">{children}</article>
        </div>
      </div>
    </div>
  );
}

// ── Shared prose section component ─────────────────────────────────────────

export function LegalSection({
  id,
  heading,
  children,
}: {
  id: string;
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mb-12 scroll-mt-24">
      {/* Dark header strip */}
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
        <div className="w-1 h-6 rounded-full bg-gradient-to-b from-indigo-500 to-violet-600 flex-shrink-0" />
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">{heading}</h2>
      </div>
      <div className="space-y-4 text-[0.9375rem] text-slate-600 leading-relaxed">
        {children}
      </div>
    </section>
  );
}

export function LegalHighlight({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-indigo-100 my-6">
      <div className="px-5 py-3 bg-slate-900">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">Key Point</span>
        </div>
      </div>
      <div className="px-5 py-4 bg-indigo-50/60 text-sm text-indigo-800 leading-relaxed font-medium">
        {children}
      </div>
    </div>
  );
}

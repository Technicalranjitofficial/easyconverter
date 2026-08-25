import Link from "next/link";
import {
  ArrowRight, Image as ImageIcon, FileText, Video, Music, Hash,
  Zap, Shield, Star, Users, CheckCircle2
} from "lucide-react";
import { imageTools } from "@/config/tools";

const stats = [
  { value: "50M+",  label: "Files Converted",   icon: "⚡" },
  { value: "100+",  label: "Free Tools",         icon: "🛠️" },
  { value: "4.9/5", label: "User Rating",         icon: "⭐" },
  { value: "0s",    label: "Upload Time",          icon: "🔒" },
];

const features = [
  {
    icon: Shield,
    title: "100% Private",
    description: "Files are processed entirely in your browser. Nothing is ever uploaded to any server.",
    color: "emerald",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Conversion happens on your device using native browser APIs. Results in milliseconds.",
    color: "indigo",
  },
  {
    icon: Star,
    title: "Zero Cost",
    description: "No subscription, no account, no watermarks. Every tool is free, forever.",
    color: "violet",
  },
  {
    icon: Users,
    title: "Batch Convert",
    description: "Upload up to 20 files at once and convert them all with a single click.",
    color: "sky",
  },
];

const categories = [
  {
    icon: ImageIcon,
    name: "Image Tools",
    description: "Convert, compress, and resize images in seconds",
    href: "/image",
    count: 17,
    available: true,
    gradient: "from-indigo-500 to-violet-600",
    bg: "from-indigo-50 to-violet-50",
    border: "border-indigo-100 hover:border-indigo-200",
  },
  {
    icon: FileText,
    name: "PDF Tools",
    description: "Convert, merge, split, and compress PDFs",
    href: "#",
    count: 8,
    available: false,
    gradient: "from-rose-500 to-pink-600",
    bg: "from-rose-50 to-pink-50",
    border: "border-rose-100",
  },
  {
    icon: Video,
    name: "Video Tools",
    description: "Convert videos to any format instantly",
    href: "#",
    count: 6,
    available: false,
    gradient: "from-orange-500 to-amber-500",
    bg: "from-orange-50 to-amber-50",
    border: "border-orange-100",
  },
  {
    icon: Music,
    name: "Audio Tools",
    description: "Convert and compress audio files",
    href: "#",
    count: 6,
    available: false,
    gradient: "from-sky-500 to-cyan-500",
    bg: "from-sky-50 to-cyan-50",
    border: "border-sky-100",
  },
  {
    icon: Hash,
    name: "Code & Data",
    description: "JSON, Base64, CSV and code converters",
    href: "#",
    count: 12,
    available: false,
    gradient: "from-emerald-500 to-teal-500",
    bg: "from-emerald-50 to-teal-50",
    border: "border-emerald-100",
  },
];

export default function HomePage() {
  const popularTools = [...imageTools].sort((a, b) => b.searchVolume - a.searchVolume).slice(0, 6);

  return (
    <div className="overflow-x-hidden">

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative hero-mesh min-h-[88vh] flex flex-col items-center justify-center
                          px-4 sm:px-6 py-20 sm:py-28 text-center overflow-hidden">

        {/* Background decorations */}
        <div className="absolute top-24 left-1/4 w-72 h-72 rounded-full
                        bg-indigo-200/25 blur-3xl pointer-events-none animate-float" />
        <div className="absolute bottom-24 right-1/4 w-64 h-64 rounded-full
                        bg-violet-200/20 blur-3xl pointer-events-none"
             style={{ animation: "float 4s ease-in-out 1s infinite" }} />
        <div className="absolute top-1/2 left-8 w-48 h-48 rounded-full
                        bg-sky-100/30 blur-2xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto">
          {/* Trust badges — 21st.dev pill row */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8 animate-fade-in-up">
            {/* Live pulse badge */}
            <span className="inline-flex items-center gap-1.5 h-8 pl-1.5 pr-3.5
                             rounded-full text-xs font-semibold
                             bg-indigo-50 text-indigo-700 border border-indigo-200/80
                             shadow-[0_0_0_3px_rgba(99,102,241,0.08)]">
              <span className="relative flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500">
                <span className="absolute inline-flex h-3 w-3 animate-ping rounded-full bg-indigo-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
              </span>
              100% Free
            </span>

            {/* Divider */}
            <span className="text-slate-200 text-base select-none">|</span>

            {/* Privacy badge */}
            <span className="inline-flex items-center gap-1.5 h-8 px-3.5
                             rounded-full text-xs font-medium
                             bg-emerald-50 text-emerald-700 border border-emerald-200/80">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              Files never leave your browser
            </span>

            {/* Divider */}
            <span className="text-slate-200 text-base select-none">|</span>

            {/* No account badge */}
            <span className="inline-flex items-center gap-1.5 h-8 px-3.5
                             rounded-full text-xs font-medium
                             bg-slate-100 text-slate-600 border border-slate-200/80">
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
              No account needed
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900
                          tracking-tight leading-[1.08] mb-6 animate-fade-in-up animate-delay-75">
            Convert{" "}
            <span className="relative">
              <span className="text-gradient">Anything</span>
              {/* Underline decoration */}
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                <path d="M2 9 Q75 2 150 8 Q225 14 298 6" stroke="url(#grad)" strokeWidth="3"
                      strokeLinecap="round" fill="none"/>
                <defs>
                  <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
            <br className="hidden sm:block" />
            <span className="text-slate-400 font-light"> Instantly</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed
                         animate-fade-in-up animate-delay-150">
            100+ free online tools. Convert images, PDFs, videos and more — all
            processing happens <strong className="text-slate-700 font-semibold">directly in your browser</strong>.
            Zero uploads, zero cost.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16
                           animate-fade-in-up animate-delay-200">
            <Link href="/image" className="btn-primary px-8 py-3.5 text-base rounded-2xl">
              <Zap className="w-4 h-4" fill="currentColor" />
              Start Converting for Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/image" className="btn-secondary px-8 py-3.5 text-base rounded-2xl">
              <ImageIcon className="w-4 h-4 text-indigo-500" />
              Browse Image Tools
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-3 animate-fade-in-up animate-delay-300">
            {[
              { icon: "🔒", text: "No file upload" },
              { icon: "✨", text: "No watermarks" },
              { icon: "👤", text: "No account" },
              { icon: "♾️",  text: "Unlimited free" },
              { icon: "⚡", text: "Instant results" },
            ].map((b) => (
              <span
                key={b.text}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm
                           bg-white border border-slate-200 text-slate-600
                           shadow-sm shadow-slate-100/50 font-medium"
              >
                <span>{b.icon}</span>
                {b.text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats bar ─────────────────────────────────────────── */}
      <section className="border-y border-slate-800 bg-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="stat-card flex flex-col items-center text-center py-2">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-400 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Popular Tools ─────────────────────────────────────── */}
      <section className="bg-slate-950 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-sm font-semibold text-indigo-400 uppercase tracking-widest mb-2">
                Most Popular
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Popular Tools
              </h2>
            </div>
            <Link
              href="/image"
              className="hidden sm:flex items-center gap-1.5 text-sm font-medium
                         text-indigo-400 hover:text-indigo-300 transition-colors group"
            >
              View all tools
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularTools.map((tool, i) => (
              <Link
                key={tool.id}
                href={tool.slug}
                className="tool-card group flex items-center gap-4 p-5 rounded-2xl
                           bg-slate-800/60 border border-slate-700/60
                           hover:border-indigo-500/60 hover:bg-slate-800
                           hover:shadow-lg hover:shadow-indigo-500/10
                           hover:-translate-y-0.5 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center
                                transition-all duration-300 group-hover:scale-110"
                     style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(124,58,237,0.2) 100%)" }}>
                  <ImageIcon className="w-5 h-5 text-indigo-400" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-100 text-sm group-hover:text-indigo-300
                                 transition-colors truncate">
                    {tool.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Free
                    </span>
                    <span className="text-xs text-slate-600">·</span>
                    <span className="text-xs text-slate-500">No upload</span>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-600 flex-shrink-0
                                       group-hover:text-indigo-400 group-hover:translate-x-0.5
                                       transition-all duration-200" />
              </Link>
            ))}
          </div>

          <div className="mt-6 sm:hidden text-center">
            <Link href="/image" className="btn-secondary text-sm">
              View all image tools <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Categories ────────────────────────────────────────── */}
      <section className="bg-[#07080f] border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-indigo-400 uppercase tracking-widest mb-3">
              All Categories
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-4">
              Every Conversion You Need
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              From images to documents to code — one platform for all your conversion needs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat, i) => {
              const Icon = cat.icon;

              // Color map for dark backgrounds
              const darkIconBg: Record<string, string> = {
                "from-indigo-500 to-violet-600":   "rgba(99,102,241,0.15)",
                "from-rose-500 to-pink-600":        "rgba(244,63,94,0.12)",
                "from-orange-500 to-amber-500":     "rgba(249,115,22,0.12)",
                "from-sky-500 to-cyan-500":         "rgba(14,165,233,0.12)",
                "from-emerald-500 to-teal-500":     "rgba(16,185,129,0.12)",
              };
              const iconBg = darkIconBg[cat.gradient] ?? "rgba(99,102,241,0.12)";

              const darkIconColor: Record<string, string> = {
                "from-indigo-500 to-violet-600": "text-indigo-400",
                "from-rose-500 to-pink-600":      "text-rose-400",
                "from-orange-500 to-amber-500":   "text-amber-400",
                "from-sky-500 to-cyan-500":       "text-sky-400",
                "from-emerald-500 to-teal-500":   "text-emerald-400",
              };
              const iconColor = darkIconColor[cat.gradient] ?? "text-indigo-400";

              const darkBadgeColor: Record<string, string> = {
                "from-indigo-500 to-violet-600": "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
                "from-rose-500 to-pink-600":      "bg-rose-500/10 text-rose-300 border-rose-500/20",
                "from-orange-500 to-amber-500":   "bg-amber-500/10 text-amber-300 border-amber-500/20",
                "from-sky-500 to-cyan-500":       "bg-sky-500/10 text-sky-300 border-sky-500/20",
                "from-emerald-500 to-teal-500":   "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
              };
              const badgeCls = darkBadgeColor[cat.gradient] ?? "bg-indigo-500/10 text-indigo-300 border-indigo-500/20";

              const inner = (
                <div
                  className={`tool-card h-full flex flex-col p-6 rounded-2xl
                              border border-slate-700/50
                              transition-all duration-300
                              ${cat.available
                                ? "bg-slate-800/50 hover:bg-slate-800 hover:border-slate-600 hover:shadow-xl hover:shadow-black/30 hover:-translate-y-1 cursor-pointer"
                                : "bg-slate-900/60 opacity-60"
                              }`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl" style={{ background: iconBg }}>
                      <Icon className={`w-6 h-6 ${iconColor}`} />
                    </div>
                    {!cat.available && (
                      <span className={`text-[10px] font-bold uppercase tracking-widest
                                       border px-2.5 py-1 rounded-full ${badgeCls}`}>
                        Coming Soon
                      </span>
                    )}
                    {cat.available && (
                      <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400
                                             group-hover:translate-x-0.5 transition-all duration-200 mt-1" />
                    )}
                  </div>

                  <h3 className="font-bold text-white text-lg mb-1.5">{cat.name}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed flex-1">{cat.description}</p>

                  <div className="mt-5 pt-4 border-t border-slate-700/50 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">
                      {cat.count} tools available
                    </span>
                    {cat.available && (
                      <span className={`text-xs font-semibold flex items-center gap-1 ${iconColor}`}>
                        Explore <ArrowRight className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              );

              return cat.available ? (
                <Link key={cat.name} href={cat.href} className="group block h-full" style={{ animationDelay: `${i * 80}ms` }}>
                  {inner}
                </Link>
              ) : (
                <div key={cat.name} className="h-full">{inner}</div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────── */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="max-w-xl mx-auto text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-3">
              Why EasyConverter.io
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
              Built Different
            </h2>
            <p className="text-slate-500 text-base leading-relaxed">
              Most converters upload your files to a server. We don&apos;t.
              Everything runs locally — no data, no privacy concerns, no limits.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-100 rounded-2xl overflow-hidden shadow-sm">
            {features.map((f) => {
              const Icon = f.icon;
              const iconStyles: Record<string, { wrap: string; icon: string }> = {
                emerald: { wrap: "bg-emerald-50",  icon: "text-emerald-600" },
                indigo:  { wrap: "bg-indigo-50",   icon: "text-indigo-600"  },
                violet:  { wrap: "bg-violet-50",   icon: "text-violet-600"  },
                sky:     { wrap: "bg-sky-50",      icon: "text-sky-600"     },
              };
              const s = iconStyles[f.color];

              return (
                <div key={f.title} className="bg-white p-8 flex flex-col gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.wrap}`}>
                    <Icon className={`w-5 h-5 ${s.icon}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1.5">{f.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{f.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────── */}
      <section className="bg-white px-4 sm:px-6 lg:px-8 pb-24 pt-2">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-700
                          px-8 py-16 sm:py-20 text-center">

            <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-4">
              No sign-up required
            </p>

            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
              Ready to convert your files?
            </h2>
            <p className="text-indigo-200 mb-10 max-w-md mx-auto text-base leading-relaxed">
              100% free, 100% private. Your files stay on your device — always.
            </p>

            <Link
              href="/image"
              className="inline-flex items-center gap-2.5 bg-white text-indigo-700
                         font-bold px-8 py-4 rounded-2xl text-base
                         hover:-translate-y-0.5 active:translate-y-0
                         transition-all duration-200
                         shadow-lg shadow-indigo-900/20 hover:shadow-xl hover:shadow-indigo-900/25"
            >
              <Zap className="w-4 h-4" fill="currentColor" />
              Start Converting — It&apos;s Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

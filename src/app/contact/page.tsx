import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Mail, MessageSquare, Bug, Lightbulb, Handshake } from "lucide-react";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Us – EasyConverter.io",
  description:
    "Get in touch with the EasyConverter.io team. Report bugs, request new tools, or ask about partnerships.",
  alternates: { canonical: "https://easyconverter.io/contact" },
};

const reasons = [
  {
    icon: Lightbulb,
    color: "bg-amber-50 text-amber-500",
    title: "Request a Tool",
    desc: "Missing a converter you need? Let us know.",
  },
  {
    icon: Bug,
    color: "bg-red-50 text-red-500",
    title: "Report a Bug",
    desc: "Something not working as expected?",
  },
  {
    icon: MessageSquare,
    color: "bg-indigo-50 text-indigo-500",
    title: "General Feedback",
    desc: "Ideas to improve the experience.",
  },
  {
    icon: Handshake,
    color: "bg-emerald-50 text-emerald-500",
    title: "Partnership",
    desc: "Advertising, integrations, or collaboration.",
  },
];

export default function ContactPage() {
  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-b from-slate-50/80 to-white border-b border-slate-100/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <nav className="flex items-center gap-1 text-xs text-slate-400 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-indigo-500 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
            <span className="text-slate-500 font-medium">Contact</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5
                          bg-indigo-50 border border-indigo-100
                          text-xs font-semibold text-indigo-600">
            ✉️  Contact Us
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
            Get in Touch
          </h1>
          <p className="text-[1.0625rem] text-slate-500 max-w-xl leading-relaxed">
            We read every message. Typical response time is 1–2 business days.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid lg:grid-cols-[1fr_380px] gap-12 lg:gap-16">

          {/* Form */}
          <div>
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Send us a message</h2>
              <p className="text-sm text-slate-500">
                Fill in the form below and we&apos;ll get back to you as soon as we can.
              </p>
            </div>
            <ContactForm />
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Direct email */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
              <div className="px-5 py-3 bg-slate-900 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
                  Direct Email
                </span>
              </div>
              <div className="px-5 py-4 bg-white space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-indigo-500" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">General enquiries</p>
                    <a
                      href="mailto:hello@easyconverter.io"
                      className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      hello@easyconverter.io
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Privacy / legal</p>
                    <a
                      href="mailto:privacy@easyconverter.io"
                      className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors"
                    >
                      privacy@easyconverter.io
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Reason cards */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Common Reasons to Write
              </p>
              {reasons.map((r) => {
                const Icon = r.icon;
                return (
                  <div
                    key={r.title}
                    className="flex items-start gap-3 p-4 rounded-xl
                               bg-white border border-slate-100 shadow-sm"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${r.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{r.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{r.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legal links */}
            <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-4">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
                Legal
              </p>
              <div className="space-y-2">
                {[
                  { label: "Privacy Policy", href: "/privacy" },
                  { label: "Terms of Service", href: "/terms" },
                  { label: "Cookie Policy", href: "/cookies" },
                ].map(l => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="block text-sm text-slate-500 hover:text-indigo-600 transition-colors"
                  >
                    {l.label} →
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

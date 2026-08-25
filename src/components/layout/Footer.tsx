import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Logo from "./Logo";
import { imageTools } from "@/config/tools";

// Show the 7 highest-traffic tools in the footer
const footerTools = imageTools
  .sort((a, b) => b.searchVolume - a.searchVolume)
  .slice(0, 7);

const comingSoon = ["PDF to Word", "PDF Compress", "MP4 to MP3", "JSON to CSV", "Video Compress"];

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">

        {/* Top grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand col */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo className="mb-4" />

            <p className="text-sm text-slate-500 leading-relaxed mb-5 max-w-[230px]">
              Free online file conversion tools. 100% client-side processing — your files never leave your browser.
            </p>

            <div className="flex flex-wrap gap-2">
              {["No Upload", "100% Free", "No Account"].map((badge) => (
                <span
                  key={badge}
                  className="text-xs font-medium px-2.5 py-1 rounded-full
                             bg-indigo-50 text-indigo-600 border border-indigo-100"
                >
                  ✓ {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Image Tools */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-5">
              Image Tools
            </h3>
            <ul className="space-y-3">
              {footerTools.map((t) => (
                <li key={t.id}>
                  <Link
                    href={t.slug}
                    className="text-sm text-slate-500 hover:text-indigo-600
                               transition-colors flex items-center gap-1.5 group"
                  >
                    <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-indigo-400
                                           transition-all group-hover:translate-x-0.5" />
                    {t.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/image"
                  className="text-sm font-medium text-indigo-500 hover:text-indigo-700
                             transition-colors flex items-center gap-1.5 group mt-1"
                >
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-all" />
                  View all tools
                </Link>
              </li>
            </ul>
          </div>

          {/* Coming Soon */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-5">
              Coming Soon
            </h3>
            <ul className="space-y-3">
              {comingSoon.map((tool) => (
                <li key={tool}
                    className="text-sm text-slate-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-200 flex-shrink-0" />
                  {tool}
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-5">
              Company
            </h3>
            <ul className="space-y-3">
              {[
                { label: "About Us",        href: "/about"   },
                { label: "Privacy Policy",  href: "/privacy" },
                { label: "Terms of Service",href: "/terms"   },
                { label: "Cookie Policy",   href: "/cookies" },
                { label: "Contact Us",      href: "/contact" },
              ].map((t) => (
                <li key={t.label}>
                  <Link
                    href={t.href}
                    className="text-sm text-slate-500 hover:text-indigo-600 transition-colors"
                  >
                    {t.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row
                        items-center justify-between gap-3">
          <p className="text-xs text-slate-400 text-center sm:text-left">
            © {new Date().getFullYear()} EasyConverter.io — All rights reserved
          </p>
          <p className="text-xs text-slate-400 text-center">
            🔒 Files are processed locally. We never see your data.
          </p>
        </div>
      </div>
    </footer>
  );
}

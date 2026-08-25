"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, Zap, ArrowRight,
         RefreshCw, Minimize2, Maximize2, Crop,
         FileImage, Layers } from "lucide-react";
import Logo from "./Logo";
import { imageTools } from "@/config/tools";

// ── Categorise all image tools for the mega-menu ─────────────────────────────

const imageToolGroups = [
  {
    heading: "Format Conversion",
    icon: RefreshCw,
    color: "text-indigo-500",
    tools: imageTools.filter(t =>
      ["jpg-to-png","png-to-jpg","image-to-webp",
       "webp-to-jpg","webp-to-png","png-to-webp","jpg-to-webp"].includes(t.id)
    ),
  },
  {
    heading: "Optimise & Edit",
    icon: Minimize2,
    color: "text-violet-500",
    tools: imageTools.filter(t =>
      ["image-compressor","image-resizer","image-cropper"].includes(t.id)
    ),
  },
  {
    heading: "Special Formats",
    icon: FileImage,
    color: "text-sky-500",
    tools: imageTools.filter(t =>
      ["svg-to-png","gif-to-png"].includes(t.id)
    ),
  },
];

const comingSoonGroups = [
  { label: "PDF Tools",   icon: Layers,   count: 8  },
  { label: "Video Tools", icon: Maximize2, count: 6  },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [scrolled, setScrolled]       = useState(false);
  const [imgDropdown, setImgDropdown] = useState(false);
  const dropRef                       = useRef<HTMLDivElement>(null);
  const timeoutRef                    = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setImgDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const openDrop  = () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); setImgDropdown(true);  };
  const closeDrop = () => { timeoutRef.current = setTimeout(() => setImgDropdown(false), 120); };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/92 backdrop-blur-xl shadow-sm shadow-slate-100/80 border-b border-slate-100"
          : "bg-white/75 backdrop-blur-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">

        {/* Logo */}
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">

          {/* Image Tools mega-dropdown */}
          <div
            ref={dropRef}
            className="relative"
            onMouseEnter={openDrop}
            onMouseLeave={closeDrop}
          >
            <button
              onClick={() => setImgDropdown(v => !v)}
              className="flex items-center gap-1 px-3.5 py-2 rounded-xl text-sm font-medium
                         text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all duration-150"
            >
              Image Tools
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                imgDropdown ? "rotate-180" : ""
              }`} />
            </button>

            {/* Mega-menu panel */}
            {imgDropdown && (
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[640px] animate-scale-in"
                onMouseEnter={openDrop}
                onMouseLeave={closeDrop}
              >
                <div className="bg-white rounded-2xl shadow-2xl shadow-slate-200/60
                                border border-slate-100 overflow-hidden">

                  {/* Dark header bar */}
                  <div className="flex items-center justify-between px-5 py-3
                                  bg-slate-900 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                      <span className="text-xs font-semibold text-slate-300 tracking-wide uppercase">
                        {imageTools.length} Image Tools
                      </span>
                    </div>
                    <Link
                      href="/image"
                      className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300
                                 font-medium transition-colors"
                    >
                      View all <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>

                  {/* Tool groups grid */}
                  <div className="grid grid-cols-3 divide-x divide-slate-100">
                    {imageToolGroups.map((group) => {
                      const GroupIcon = group.icon;
                      return (
                        <div key={group.heading} className="py-4 px-4">
                          {/* Group heading */}
                          <div className="flex items-center gap-1.5 mb-3">
                            <GroupIcon className={`w-3.5 h-3.5 ${group.color}`} />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                              {group.heading}
                            </span>
                          </div>

                          {/* Tool links */}
                          <div className="space-y-0.5">
                            {group.tools.map((tool) => (
                              <Link
                                key={tool.id}
                                href={tool.slug}
                                onClick={() => setImgDropdown(false)}
                                className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-sm
                                           text-slate-600 hover:text-indigo-700 hover:bg-indigo-50/70
                                           transition-all duration-150 group/item"
                              >
                                <span className="w-1 h-1 rounded-full bg-slate-300
                                                 group-hover/item:bg-indigo-400 transition-colors flex-shrink-0" />
                                <span className="font-medium truncate">{tool.title}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Coming soon footer */}
                  <div className="border-t border-slate-100 px-5 py-3 bg-slate-50/60
                                  flex items-center gap-4">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                      Coming soon
                    </span>
                    {comingSoonGroups.map((g) => {
                      const Icon = g.icon;
                      return (
                        <div key={g.label}
                             className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Icon className="w-3.5 h-3.5" />
                          {g.label}
                          <span className="bg-slate-200 text-slate-500 text-[10px]
                                           font-semibold px-1.5 py-0.5 rounded-full">
                            {g.count} tools
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Placeholder nav items */}
          {["PDF Tools", "Video Tools"].map((label) => (
            <button
              key={label}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium
                         text-slate-400 cursor-default select-none"
              tabIndex={-1}
            >
              {label}
              <span className="text-[10px] font-bold uppercase tracking-wider
                               bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded-full">
                Soon
              </span>
            </button>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/image"
            className="inline-flex items-center gap-1.5 font-semibold text-white text-sm
                       px-4 py-2 rounded-xl transition-all duration-200
                       hover:-translate-y-0.5 active:translate-y-0"
            style={{
              background: "linear-gradient(135deg, #0f172a 0%, #4f46e5 60%, #6366f1 100%)",
              boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
            }}
          >
            <Zap className="w-3.5 h-3.5" fill="currentColor" />
            Start Converting
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors"
          onClick={() => setMobileOpen(v => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen
            ? <X className="w-5 h-5 text-slate-600" />
            : <Menu className="w-5 h-5 text-slate-600" />
          }
        </button>
      </div>

      {/* ── Mobile nav ────────────────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white/97 backdrop-blur-xl
                        px-4 py-4 space-y-1 animate-fade-in max-h-[80vh] overflow-y-auto">

          {/* Image Tools header */}
          <div className="px-4 pt-2 pb-1">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Image Tools
              </span>
              <Link
                href="/image"
                onClick={() => setMobileOpen(false)}
                className="text-xs text-indigo-600 font-semibold flex items-center gap-1"
              >
                All tools <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {imageToolGroups.map((group) => (
              <div key={group.heading} className="mb-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300 mb-1.5 px-1">
                  {group.heading}
                </p>
                <div className="grid grid-cols-2 gap-1">
                  {group.tools.map((tool) => (
                    <Link
                      key={tool.id}
                      href={tool.slug}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm
                                 font-medium text-slate-600 bg-slate-50
                                 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-300 flex-shrink-0" />
                      <span className="truncate">{tool.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Coming soon */}
          <div className="border-t border-slate-100 pt-3 pb-1 px-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300 mb-2">
              Coming soon
            </p>
            {["PDF Tools", "Video Tools", "Audio Tools"].map((label) => (
              <div
                key={label}
                className="flex items-center justify-between px-4 py-3 rounded-xl
                           text-sm font-medium text-slate-400"
              >
                {label}
                <span className="text-[10px] uppercase tracking-wider bg-slate-100
                                 text-slate-400 px-2 py-0.5 rounded-full">Soon</span>
              </div>
            ))}
          </div>

          <div className="pt-2 pb-1">
            <Link
              href="/image"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 w-full font-semibold
                         text-white text-sm py-3.5 rounded-2xl transition-all"
              style={{
                background: "linear-gradient(135deg, #0f172a 0%, #4f46e5 60%, #6366f1 100%)",
                boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
              }}
            >
              <Zap className="w-4 h-4" fill="currentColor" />
              Start Converting Free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

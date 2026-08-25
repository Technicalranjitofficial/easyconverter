"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FAQ } from "@/config/tools";

interface ToolFAQProps {
  faqs: FAQ[];
}

export default function ToolFAQ({ faqs }: ToolFAQProps) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="w-full">
      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-5">
        Frequently Asked Questions
      </h2>

      <div className="space-y-2">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-200 dark:border-slate-700/60
                       bg-white dark:bg-slate-800/40 overflow-hidden
                       transition-colors duration-200"
          >
            <button
              className="w-full flex items-center justify-between gap-4
                         px-5 py-4 text-left"
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
            >
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                {faq.question}
              </span>
              <ChevronDown
                className={`w-4 h-4 flex-shrink-0 text-slate-400 transition-transform duration-200 ${
                  open === i ? "rotate-180" : ""
                }`}
              />
            </button>

            {open === i && (
              <div className="px-5 pb-4 animate-fade-in">
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

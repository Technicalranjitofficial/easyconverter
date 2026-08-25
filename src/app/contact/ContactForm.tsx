"use client";

import { useState } from "react";
import { Send, CheckCircle2, Loader2 } from "lucide-react";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    // Simulate send — replace with a real form endpoint (Formspree, Resend, etc.)
    await new Promise(r => setTimeout(r, 1200));
    setStatus("sent");
  };

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center text-center py-16 px-8 rounded-2xl
                      bg-emerald-50 border border-emerald-200">
        <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center mb-5">
          <CheckCircle2 className="w-7 h-7 text-emerald-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Message sent!</h3>
        <p className="text-slate-500 text-sm max-w-xs">
          Thanks for reaching out. We&apos;ll get back to you within 1–2 business days.
        </p>
        <button
          onClick={() => { setStatus("idle"); setForm({ name: "", email: "", subject: "", message: "" }); }}
          className="mt-6 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name + Email row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Your Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Jane Smith"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-700
                       placeholder-slate-300 bg-white
                       focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                       transition-all"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="jane@example.com"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-700
                       placeholder-slate-300 bg-white
                       focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                       transition-all"
          />
        </div>
      </div>

      {/* Subject */}
      <div className="space-y-1.5">
        <label htmlFor="subject" className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
          Subject
        </label>
        <select
          id="subject"
          name="subject"
          required
          value={form.subject}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-700
                     bg-white appearance-none
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                     transition-all"
        >
          <option value="">Select a topic…</option>
          <option value="tool-request">Request a new tool</option>
          <option value="bug">Report a bug</option>
          <option value="feedback">General feedback</option>
          <option value="partnership">Partnership / advertising</option>
          <option value="legal">Legal / privacy inquiry</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Message */}
      <div className="space-y-1.5">
        <label htmlFor="message" className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder="Tell us what's on your mind…"
          value={form.message}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-700
                     placeholder-slate-300 bg-white resize-none
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                     transition-all"
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-500">
          Something went wrong. Please try emailing us directly at{" "}
          <a href="mailto:hello@easyconverter.io" className="underline">
            hello@easyconverter.io
          </a>
          .
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full flex items-center justify-center gap-2.5
                   py-4 px-8 rounded-2xl font-semibold text-white text-sm
                   bg-gradient-to-r from-slate-900 via-indigo-700 to-indigo-600
                   hover:from-slate-800 hover:via-indigo-600 hover:to-indigo-500
                   disabled:opacity-60 disabled:cursor-not-allowed
                   shadow-[0_4px_20px_rgba(79,70,229,0.4)]
                   hover:shadow-[0_6px_28px_rgba(79,70,229,0.5)]
                   hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
      >
        {status === "sending"
          ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
          : <><Send className="w-4 h-4" /> Send Message</>
        }
      </button>
    </form>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Zap, Users, Globe, Heart, ArrowRight } from "lucide-react";
import LegalPageShell, { LegalSection, LegalHighlight } from "@/components/layout/LegalPageShell";

export const metadata: Metadata = {
  title: "About EasyConverter.io – Free, Private File Conversion",
  description:
    "Learn why EasyConverter.io was built — a 100% browser-based file conversion tool that respects your privacy and never uploads your files.",
  alternates: { canonical: "https://www.easyconverter.io/about" },
};

const sections = [
  { id: "mission",    heading: "Our Mission" },
  { id: "how",        heading: "How It Works" },
  { id: "privacy",    heading: "Privacy First" },
  { id: "technology", heading: "The Technology" },
  { id: "free",       heading: "Why It's Free" },
  { id: "contact",    heading: "Get in Touch" },
];

const stats = [
  { value: "12+",   label: "Image Tools",     icon: Zap    },
  { value: "100%",  label: "Browser-Based",   icon: Shield },
  { value: "0",     label: "Files Uploaded",  icon: Globe  },
  { value: "Free",  label: "Forever",         icon: Heart  },
];

export default function AboutPage() {
  return (
    <LegalPageShell
      badge="📖  About Us"
      title="About EasyConverter.io"
      subtitle="A free, private, and instant file conversion toolkit that runs entirely in your browser — no uploads, no accounts, no nonsense."
      sections={sections}
    >
      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12 not-prose">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label}
                 className="flex flex-col items-center text-center p-5 rounded-2xl
                            bg-white border border-slate-100 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center mb-3">
                <Icon className="w-5 h-5 text-indigo-500" />
              </div>
              <div className="text-2xl font-bold text-slate-900 tracking-tight">{s.value}</div>
              <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
            </div>
          );
        })}
      </div>

      <LegalSection id="mission" heading="Our Mission">
        <p>
          EasyConverter.io was built with one goal: give everyone a fast, private, and completely
          free way to convert files without uploading them to a stranger&apos;s server.
        </p>
        <p>
          Most online converters upload your files to their own infrastructure, process them
          server-side, and sometimes retain copies for analytics or improvement. We think that&apos;s
          unnecessary — modern browsers are powerful enough to do the work locally.
        </p>
        <LegalHighlight>
          Every conversion on EasyConverter.io runs 100% inside your browser. Your files never
          leave your device. We have no server that receives your images, documents, or videos.
        </LegalHighlight>
      </LegalSection>

      <LegalSection id="how" heading="How It Works">
        <p>
          When you drop a file onto our converter, it&apos;s processed entirely using browser-native
          APIs — primarily the{" "}
          <strong>Canvas API</strong> for image operations and{" "}
          <strong>FileReader API</strong> for reading file data. The output is generated in memory
          and downloaded directly to your device.
        </p>
        <h3>The conversion pipeline</h3>
        <ul>
          <li>Your file is read into memory using the browser&apos;s FileReader API.</li>
          <li>For image operations, the file is drawn onto an HTML Canvas element.</li>
          <li>Canvas&apos;s <code>toBlob()</code> method encodes the output in the target format.</li>
          <li>The result blob is offered as a download — no network request is made.</li>
        </ul>
        <p>
          This means conversions are instant (limited only by your device&apos;s CPU), work
          completely offline, and require no server infrastructure on our side.
        </p>
      </LegalSection>

      <LegalSection id="privacy" heading="Privacy First">
        <p>
          We don&apos;t collect, store, or transmit your files. Period. The architecture makes it
          technically impossible for us to see your content — no file ever reaches our servers
          because we don&apos;t have a file-processing server.
        </p>
        <p>
          The only data we collect is standard anonymised analytics (page views, referrer, country)
          to understand which tools are most useful. We use Google Analytics for this, which can
          be blocked via your browser&apos;s built-in tracking protection.
        </p>
        <p>
          For the full details, read our{" "}
          <Link href="/privacy">Privacy Policy</Link>.
        </p>
      </LegalSection>

      <LegalSection id="technology" heading="The Technology">
        <p>
          EasyConverter.io is built with <strong>Next.js 15</strong> (App Router), deployed as a
          static/edge-rendered site. Tool components are loaded dynamically (code-split) so the
          initial page load is small and fast.
        </p>
        <p>
          Image conversions use the browser&apos;s native Canvas API with hardware-accelerated
          rendering. SVG rendering uses the browser&apos;s built-in SVG engine via an{" "}
          <code>Image</code> element, and crop operations use direct{" "}
          <code>drawImage</code> with source rectangles.
        </p>
        <h3>Supported operations</h3>
        <ul>
          <li>Format conversion (JPG ↔ PNG ↔ WebP, SVG → PNG, GIF → PNG)</li>
          <li>Lossy compression with adjustable quality (JPEG/WebP)</li>
          <li>Pixel-perfect resize with aspect ratio lock</li>
          <li>Interactive crop with aspect ratio presets and rule-of-thirds grid</li>
          <li>Batch processing up to 20 files simultaneously</li>
        </ul>
      </LegalSection>

      <LegalSection id="free" heading="Why It's Free">
        <p>
          EasyConverter.io is supported by non-intrusive display advertising (Google AdSense).
          Ads are clearly separated from the tool UI and never interfere with the conversion
          experience.
        </p>
        <p>
          There are no premium tiers, no watermarks, no sign-up walls, and no artificial file
          size limits beyond what the browser can reasonably handle. We believe essential
          productivity tools should be accessible to everyone.
        </p>
      </LegalSection>

      <LegalSection id="contact" heading="Get in Touch">
        <p>
          Have a suggestion for a new tool? Found a bug? Want to report an issue?
        </p>
        <div className="not-prose mt-4">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 font-semibold text-sm text-white
                       px-5 py-3 rounded-xl transition-all hover:-translate-y-0.5"
            style={{
              background: "linear-gradient(135deg, #0f172a 0%, #4f46e5 60%, #6366f1 100%)",
              boxShadow: "0 4px 14px rgba(99,102,241,0.3)",
            }}
          >
            Contact Us <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </LegalSection>
    </LegalPageShell>
  );
}

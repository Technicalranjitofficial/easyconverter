import type { Metadata } from "next";
import Link from "next/link";
import LegalPageShell, { LegalSection, LegalHighlight } from "@/components/layout/LegalPageShell";

export const metadata: Metadata = {
  title: "Cookie Policy – EasyConverter.io",
  description:
    "EasyConverter.io cookie policy. Learn which cookies we use, why, and how to control them.",
  alternates: { canonical: "https://easyconverter.io/cookies" },
};

const sections = [
  { id: "what",         heading: "What Are Cookies?" },
  { id: "we-use",       heading: "Cookies We Use" },
  { id: "analytics",    heading: "Analytics Cookies" },
  { id: "advertising",  heading: "Advertising Cookies" },
  { id: "essential",    heading: "Essential Cookies" },
  { id: "control",      heading: "How to Control Cookies" },
  { id: "contact",      heading: "Contact" },
];

const cookieTable = [
  {
    name: "_ga",
    provider: "Google Analytics",
    purpose: "Distinguishes unique users",
    duration: "2 years",
    type: "Analytics",
  },
  {
    name: "_ga_*",
    provider: "Google Analytics",
    purpose: "Maintains session state",
    duration: "2 years",
    type: "Analytics",
  },
  {
    name: "__gads",
    provider: "Google AdSense",
    purpose: "Frequency capping & ad performance",
    duration: "13 months",
    type: "Advertising",
  },
  {
    name: "CONSENT",
    provider: "Google",
    purpose: "Stores user consent preferences",
    duration: "2 years",
    type: "Functional",
  },
];

export default function CookiesPage() {
  return (
    <LegalPageShell
      badge="🍪  Cookie Policy"
      title="Cookie Policy"
      subtitle="A plain-English explanation of the cookies used on EasyConverter.io, why they're there, and how you can turn them off."
      lastUpdated="January 1, 2025"
      sections={sections}
    >
      <LegalSection id="what" heading="What Are Cookies?">
        <p>
          Cookies are small text files that websites store on your browser. They help websites
          remember information about your visit — like preferences or session data — so you get
          a better experience the next time you return.
        </p>
        <p>
          Not all cookies are the same. Some are essential for a site to function at all, others
          help with analytics and performance measurement, and some are used for advertising.
        </p>
        <LegalHighlight>
          EasyConverter.io does not use cookies for conversion functionality. The file
          conversion tools work entirely in memory with no browser storage of any kind.
          Cookies on this site come exclusively from analytics and advertising services.
        </LegalHighlight>
      </LegalSection>

      <LegalSection id="we-use" heading="Cookies We Use">
        <p>
          The following cookies may be set when you visit EasyConverter.io:
        </p>

        {/* Cookie table */}
        <div className="overflow-x-auto mt-4 mb-6 not-prose rounded-2xl border border-slate-200 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-900 text-left">
                <th className="px-4 py-3 text-xs font-semibold text-slate-300 uppercase tracking-wide">Name</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-300 uppercase tracking-wide">Provider</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-300 uppercase tracking-wide">Purpose</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-300 uppercase tracking-wide">Duration</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-300 uppercase tracking-wide">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cookieTable.map((c) => (
                <tr key={c.name} className="bg-white hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-slate-700 font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-slate-500">{c.provider}</td>
                  <td className="px-4 py-3 text-slate-500">{c.purpose}</td>
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{c.duration}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      c.type === "Analytics"
                        ? "bg-indigo-50 text-indigo-600"
                        : c.type === "Advertising"
                        ? "bg-amber-50 text-amber-600"
                        : "bg-slate-100 text-slate-600"
                    }`}>
                      {c.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LegalSection>

      <LegalSection id="analytics" heading="Analytics Cookies">
        <p>
          We use <strong>Google Analytics 4</strong> to understand how visitors use EasyConverter.io.
          This helps us identify which tools are most popular, where visitors come from, and how
          to improve the site.
        </p>
        <p>
          Google Analytics uses first-party cookies (<code>_ga</code>, <code>_ga_*</code>) to
          distinguish users and track sessions. Data is anonymised — IP addresses are truncated
          and individual users cannot be identified.
        </p>
        <p>
          Google Analytics data is processed under Google&apos;s{" "}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </a>.
        </p>
      </LegalSection>

      <LegalSection id="advertising" heading="Advertising Cookies">
        <p>
          EasyConverter.io is funded by advertising served through <strong>Google AdSense</strong>.
          AdSense may set cookies to deliver relevant ads based on your interests and to prevent
          the same ad from showing too frequently.
        </p>
        <p>
          You can opt out of personalised advertising at{" "}
          <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
            adssettings.google.com
          </a>{" "}
          or through the{" "}
          <a href="https://optout.aboutads.info" target="_blank" rel="noopener noreferrer">
            Digital Advertising Alliance opt-out
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection id="essential" heading="Essential Cookies">
        <p>
          EasyConverter.io itself sets <strong>no essential cookies</strong>. No login session,
          no preferences, no conversion history. The site works fully without storing anything
          in your browser.
        </p>
        <p>
          The only cookies present are those set by Google Analytics and Google AdSense,
          both of which are loaded from external scripts.
        </p>
      </LegalSection>

      <LegalSection id="control" heading="How to Control Cookies">
        <p>You have several options to manage or disable cookies:</p>
        <h3>Browser settings</h3>
        <ul>
          <li>
            <strong>Chrome:</strong> Settings → Privacy and Security → Cookies and other site data
          </li>
          <li>
            <strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data
          </li>
          <li>
            <strong>Safari:</strong> Preferences → Privacy → Manage Website Data
          </li>
          <li>
            <strong>Edge:</strong> Settings → Cookies and site permissions
          </li>
        </ul>
        <h3>Analytics opt-out</h3>
        <ul>
          <li>
            Install the{" "}
            <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
              Google Analytics opt-out browser add-on
            </a>
          </li>
          <li>Use a privacy-focused browser (Firefox, Brave) with enhanced tracking protection enabled</li>
          <li>Use an ad blocker extension (uBlock Origin, AdGuard)</li>
        </ul>
        <p>
          Disabling cookies won&apos;t affect your ability to use any conversion tool on this site —
          all tools function entirely without cookies.
        </p>
      </LegalSection>

      <LegalSection id="contact" heading="Contact">
        <p>
          Questions about this Cookie Policy? Contact us:
        </p>
        <ul>
          <li>
            Email: <a href="mailto:privacy@easyconverter.io">privacy@easyconverter.io</a>
          </li>
          <li>
            Via our <Link href="/contact">contact form</Link>
          </li>
        </ul>
      </LegalSection>
    </LegalPageShell>
  );
}

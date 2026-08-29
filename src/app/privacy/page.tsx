import type { Metadata } from "next";
import Link from "next/link";
import LegalPageShell, { LegalSection, LegalHighlight } from "@/components/layout/LegalPageShell";

export const metadata: Metadata = {
  title: "Privacy Policy – EasyConverter.io",
  description:
    "EasyConverter.io privacy policy. Your files never leave your browser. We explain exactly what data we collect and how we use it.",
  alternates: { canonical: "https://www.easyconverter.io/privacy" },
};

const sections = [
  { id: "overview",      heading: "Overview" },
  { id: "file-data",     heading: "Your Files & Conversion Data" },
  { id: "analytics",     heading: "Analytics & Cookies" },
  { id: "advertising",   heading: "Advertising" },
  { id: "third-parties", heading: "Third-Party Services" },
  { id: "children",      heading: "Children's Privacy" },
  { id: "changes",       heading: "Changes to this Policy" },
  { id: "contact",       heading: "Contact" },
];

export default function PrivacyPage() {
  return (
    <LegalPageShell
      badge="🔒  Privacy Policy"
      title="Privacy Policy"
      subtitle="We built EasyConverter.io so that your files never have to leave your device. This page explains exactly what data we do and don't collect."
      lastUpdated="January 1, 2025"
      sections={sections}
    >
      <LegalSection id="overview" heading="Overview">
        <LegalHighlight>
          EasyConverter.io processes all files 100% locally in your browser. No file, image, document,
          or any conversion data is ever transmitted to our servers or any third-party server.
          We do not have a file-processing backend.
        </LegalHighlight>
        <p>
          This Privacy Policy describes how EasyConverter.io (&quot;we&quot;, &quot;us&quot;, or
          &quot;our&quot;) handles information in connection with your use of our website at{" "}
          <strong>easyconverter.io</strong> (the &quot;Service&quot;).
        </p>
        <p>
          By using the Service, you agree to the collection and use of information in accordance
          with this policy.
        </p>
      </LegalSection>

      <LegalSection id="file-data" heading="Your Files & Conversion Data">
        <p>
          <strong>We collect no file data whatsoever.</strong> When you upload a file to any
          converter on this site, the file is loaded into your browser&apos;s memory using the
          Web File API and processed entirely using client-side browser APIs (Canvas, FileReader,
          Blob). The resulting output is saved directly to your device via a client-initiated
          download.
        </p>
        <p>At no point during this process does any file data:</p>
        <ul>
          <li>Leave your device over any network connection</li>
          <li>Touch our servers or infrastructure</li>
          <li>Get stored in browser storage (localStorage, IndexedDB, cookies)</li>
          <li>Get sent to any third-party analytics or advertising service</li>
        </ul>
        <p>
          You can verify this by opening your browser&apos;s Developer Tools → Network tab and
          observing that no network requests containing file data are made during conversion.
        </p>
      </LegalSection>

      <LegalSection id="analytics" heading="Analytics & Cookies">
        <p>
          We use <strong>Google Analytics 4</strong> to collect anonymised usage statistics.
          This helps us understand which tools are popular, where visitors come from, and how
          to improve the service. The data collected includes:
        </p>
        <ul>
          <li>Pages viewed and time spent</li>
          <li>Country and general region (not precise location)</li>
          <li>Referring website</li>
          <li>Browser type and operating system</li>
          <li>Device type (desktop, mobile, tablet)</li>
        </ul>
        <p>
          This data is aggregated and anonymised — it cannot be used to identify you personally.
          Google Analytics sets cookies to distinguish users and sessions. You can opt out via:
        </p>
        <ul>
          <li>
            The{" "}
            <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
              Google Analytics opt-out browser add-on
            </a>
          </li>
          <li>Your browser&apos;s built-in tracking protection (Firefox, Brave, Safari)</li>
          <li>A browser extension such as uBlock Origin</li>
        </ul>
        <p>
          For more information, see our <Link href="/cookies">Cookie Policy</Link>.
        </p>
      </LegalSection>

      <LegalSection id="advertising" heading="Advertising">
        <p>
          EasyConverter.io displays advertisements served by <strong>Google AdSense</strong> to
          fund the free service. AdSense may use cookies and similar tracking technologies to
          show ads that are relevant to your interests based on your browsing activity across
          other sites.
        </p>
        <p>
          Google&apos;s advertising data collection is governed by{" "}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
            Google&apos;s Privacy Policy
          </a>
          . You can control personalised advertising settings at{" "}
          <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
            adssettings.google.com
          </a>
          .
        </p>
        <p>
          Ad scripts are loaded with <code>strategy=&quot;lazyOnload&quot;</code> and never
          block the conversion tools from functioning.
        </p>
      </LegalSection>

      <LegalSection id="third-parties" heading="Third-Party Services">
        <p>We use the following third-party services on this website:</p>
        <ul>
          <li>
            <strong>Google Analytics 4</strong> — anonymised usage analytics (
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>
            )
          </li>
          <li>
            <strong>Google AdSense</strong> — display advertising (
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>
            )
          </li>
          <li>
            <strong>Vercel</strong> — website hosting and edge delivery. Vercel may log IP
            addresses and request headers for security and performance purposes (
            <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>
            )
          </li>
        </ul>
        <p>
          No other third-party services receive your data. We do not sell, trade, or transfer
          your information to any third parties.
        </p>
      </LegalSection>

      <LegalSection id="children" heading="Children's Privacy">
        <p>
          EasyConverter.io is a general-purpose productivity tool suitable for all ages. We do
          not knowingly collect any personal information from children under 13. The service
          does not require account creation or personal information to use.
        </p>
      </LegalSection>

      <LegalSection id="changes" heading="Changes to this Policy">
        <p>
          We may update this Privacy Policy from time to time. When we do, we will update the
          &quot;Last updated&quot; date at the top of this page. We encourage you to review
          this policy periodically. Your continued use of the Service after any changes
          constitutes acceptance of the updated policy.
        </p>
      </LegalSection>

      <LegalSection id="contact" heading="Contact">
        <p>
          If you have any questions about this Privacy Policy or our data practices, please
          contact us:
        </p>
        <ul>
          <li>
            Email:{" "}
            <a href="mailto:privacy@easyconverter.io">privacy@easyconverter.io</a>
          </li>
          <li>
            Via our <Link href="/contact">contact form</Link>
          </li>
        </ul>
      </LegalSection>
    </LegalPageShell>
  );
}

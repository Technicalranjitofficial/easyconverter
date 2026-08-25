import type { Metadata } from "next";
import Link from "next/link";
import LegalPageShell, { LegalSection, LegalHighlight } from "@/components/layout/LegalPageShell";

export const metadata: Metadata = {
  title: "Terms of Service – EasyConverter.io",
  description:
    "Terms of service for EasyConverter.io. Free to use, no account required. Read our usage terms and limitations.",
  alternates: { canonical: "https://easyconverter.io/terms" },
};

const sections = [
  { id: "acceptance",    heading: "Acceptance of Terms" },
  { id: "service",       heading: "Description of Service" },
  { id: "use",           heading: "Acceptable Use" },
  { id: "ip",            heading: "Intellectual Property" },
  { id: "disclaimer",    heading: "Disclaimer of Warranties" },
  { id: "liability",     heading: "Limitation of Liability" },
  { id: "availability",  heading: "Service Availability" },
  { id: "changes",       heading: "Changes to Terms" },
  { id: "contact",       heading: "Contact" },
];

export default function TermsPage() {
  return (
    <LegalPageShell
      badge="📄  Terms of Service"
      title="Terms of Service"
      subtitle="By using EasyConverter.io you agree to these terms. They're straightforward — no tricks, no dark patterns."
      lastUpdated="January 1, 2025"
      sections={sections}
    >
      <LegalSection id="acceptance" heading="Acceptance of Terms">
        <p>
          By accessing or using EasyConverter.io (the &quot;Service&quot;), you agree to be bound
          by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, please
          do not use the Service.
        </p>
        <p>
          These Terms apply to all visitors, users, and others who access or use the Service.
        </p>
      </LegalSection>

      <LegalSection id="service" heading="Description of Service">
        <LegalHighlight>
          EasyConverter.io provides free, browser-based file conversion tools. All processing
          happens locally on your device. We do not upload, store, or process your files on
          any server.
        </LegalHighlight>
        <p>
          The Service currently includes image conversion and optimisation tools (format
          conversion, compression, resizing, cropping, and SVG/GIF conversion). Additional
          tool categories are planned for future release.
        </p>
        <p>
          The Service is provided free of charge and is supported by advertising revenue.
          No account registration is required to use any tool.
        </p>
      </LegalSection>

      <LegalSection id="use" heading="Acceptable Use">
        <p>You agree to use the Service only for lawful purposes. You must not:</p>
        <ul>
          <li>
            Attempt to circumvent, reverse-engineer, or interfere with any part of the
            Service&apos;s code or infrastructure
          </li>
          <li>
            Use automated tools, scrapers, or bots to bulk-access the Service in a way that
            places unreasonable load on our servers
          </li>
          <li>
            Use the Service to convert, process, or distribute content that infringes on
            third-party intellectual property rights
          </li>
          <li>
            Attempt to inject malicious code, scripts, or payloads through any input field
            or file upload mechanism
          </li>
          <li>
            Misrepresent the origin or nature of any file processed through the Service
          </li>
        </ul>
        <p>
          You are solely responsible for the content of any files you process using the Service
          and for ensuring you have the necessary rights to convert that content.
        </p>
      </LegalSection>

      <LegalSection id="ip" heading="Intellectual Property">
        <p>
          The EasyConverter.io website, including its design, code, branding, and content
          (excluding user-provided files), is owned by EasyConverter.io and protected by
          applicable intellectual property laws.
        </p>
        <p>
          <strong>Your files remain entirely yours.</strong> We make no claim to any files
          you process through the Service. Since no files are transmitted to us, we receive
          no rights, licence, or ownership interest in any content you convert.
        </p>
        <p>
          You may not reproduce, distribute, or create derivative works from the Service&apos;s
          code, design, or branding without explicit written permission.
        </p>
      </LegalSection>

      <LegalSection id="disclaimer" heading="Disclaimer of Warranties">
        <p>
          The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties
          of any kind, either express or implied, including but not limited to:
        </p>
        <ul>
          <li>Fitness for a particular purpose</li>
          <li>Accuracy or reliability of conversion output</li>
          <li>Uninterrupted or error-free operation</li>
          <li>Compatibility with all file types, browsers, or devices</li>
        </ul>
        <p>
          Conversion quality depends on the browser&apos;s Canvas API implementation, which
          varies by browser and device. We recommend verifying conversion output before use
          in production environments.
        </p>
      </LegalSection>

      <LegalSection id="liability" heading="Limitation of Liability">
        <p>
          To the maximum extent permitted by applicable law, EasyConverter.io shall not be
          liable for any indirect, incidental, special, consequential, or punitive damages
          arising from your use of (or inability to use) the Service, including but not
          limited to:
        </p>
        <ul>
          <li>Loss of data or files</li>
          <li>Loss of business or revenue</li>
          <li>Errors or inaccuracies in converted output</li>
          <li>Interrupted access to the Service</li>
        </ul>
        <p>
          Our total liability to you for any claim arising from these Terms or your use of the
          Service shall not exceed the amount you have paid us in the past twelve months (which,
          given the free nature of the Service, is likely zero).
        </p>
      </LegalSection>

      <LegalSection id="availability" heading="Service Availability">
        <p>
          We strive to keep EasyConverter.io available 24/7 but make no guarantees of uptime.
          We reserve the right to modify, suspend, or discontinue any part of the Service at
          any time without notice.
        </p>
        <p>
          Planned maintenance or unexpected outages may cause temporary unavailability.
          Because all processing is client-side, most tools will continue to function
          even if our hosting provider has partial outages.
        </p>
      </LegalSection>

      <LegalSection id="changes" heading="Changes to Terms">
        <p>
          We reserve the right to update these Terms at any time. Changes will be indicated
          by updating the &quot;Last updated&quot; date. Significant changes will be noted on
          the homepage. Your continued use of the Service after any changes constitutes
          acceptance of the new Terms.
        </p>
      </LegalSection>

      <LegalSection id="contact" heading="Contact">
        <p>
          Questions about these Terms? Reach us at:
        </p>
        <ul>
          <li>
            Email: <a href="mailto:legal@easyconverter.io">legal@easyconverter.io</a>
          </li>
          <li>
            Via our <Link href="/contact">contact form</Link>
          </li>
        </ul>
      </LegalSection>
    </LegalPageShell>
  );
}

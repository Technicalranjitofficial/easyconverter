import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { homePageMetadata } from "@/lib/seo";
import "./globals.css";

const BASE_URL = "https://www.easyconverter.io";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

/* ── Viewport (themeColor must live here, not in metadata) ────────────── */
export const viewport: Viewport = {
  themeColor: "#6366f1",
  width: "device-width",
  initialScale: 1,
};

/* ── Site-wide metadata ───────────────────────────────────────────────── */
export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "EasyConverter.io – Free Online File Converter Tools",
    template: "%s | EasyConverter.io",
  },
  ...homePageMetadata,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
    apple: [{ url: "/favicon.svg" }],
    shortcut: "/favicon.svg",
  },
  manifest: "/site.webmanifest",
};

/* ── JSON-LD structured data ─────────────────────────────────────────── */
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "EasyConverter.io",
  alternateName: "Easy Converter",
  url: BASE_URL,
  description:
    "Free online file converter tools. Convert images, compress PDFs, resize photos, convert to WebP and more. 100% browser-based — files never leave your device.",
  inLanguage: "en-US",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "EasyConverter.io",
  url: BASE_URL,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern web browser with JavaScript enabled",
  description:
    "100+ free online converter tools — images, PDFs, text, unit converters, data tools and more. No upload required. Files are processed locally in your browser.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Image conversion (JPG, PNG, WebP, SVG, GIF)",
    "PDF tools (merge, split, compress, rotate, convert)",
    "Text tools (word counter, case converter, lorem ipsum)",
    "Unit converters (length, weight, temperature, data storage)",
    "Developer tools (JSON formatter, Base64, UUID, hash generator)",
    "No file upload required — 100% browser-based",
    "Free to use, no account required",
  ],
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "EasyConverter.io",
  url: BASE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${BASE_URL}/og-default.png`,
    width: 1200,
    height: 630,
  },
  sameAs: [],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />

        {/* JSON-LD structured data — site-level */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([websiteJsonLd, webAppJsonLd, organizationJsonLd]),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />

        {/* Google AdSense — lazyOnload so it never blocks page render */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import type { ToolConfig } from "@/config/tools";

export const BASE_URL  = "https://www.easyconverter.io";
const OG_IMAGE  = `${BASE_URL}/og-default.png`;
const SITE_NAME = "EasyConverter.io";

/* ─────────────────────────────────────────────────────────────────────────
   JSON-LD helpers — rich structured data for every tool page
   These are the schemas that trigger rich results in Google Search:
   • SoftwareApplication  → shows star ratings, price ("Free"), category
   • HowTo               → shows step-by-step instructions in results
   • FAQPage             → shows expandable Q&A directly in the SERP
   • BreadcrumbList      → shows breadcrumb path under the URL
   ───────────────────────────────────────────────────────────────────────── */
export function toolJsonLd(tool: ToolConfig): object[] {
  const url = `${BASE_URL}${tool.slug}/`;

  // Category label for BreadcrumbList
  const categoryLabel =
    tool.category === "image"     ? "Image Tools"    :
    tool.category === "pdf"       ? "PDF Tools"      :
    tool.category === "text"      ? "Text Tools"     :
    tool.category === "unit"      ? "Unit Converters":
    tool.category === "utilities" ? "Utilities"      :
    tool.category === "data"      ? "Data Tools"     :
    tool.category === "code"      ? "Code Tools"     :
    tool.category === "document"  ? "Document Tools" :
    "Tools";

  const categorySlug = tool.slug.split("/")[1]; // e.g. "image" from "/image/jpg-to-png"
  const categoryUrl  = `${BASE_URL}/${categorySlug}/`;

  const schemas: object[] = [];

  /* 1. SoftwareApplication ─────────────────────────────────────────── */
  schemas.push({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.title,
    url,
    description: tool.longDescription || tool.description,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires a modern web browser with JavaScript enabled",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: Math.max(50, Math.round(tool.searchVolume / 5000)),
      bestRating: "5",
      worstRating: "1",
    },
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: BASE_URL,
    },
    featureList: tool.keywords.slice(0, 5).join(", "),
  });

  /* 2. HowTo (only when howToSteps exist) ─────────────────────────── */
  if (tool.howToSteps && tool.howToSteps.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: `How to ${tool.actionVerb}`,
      description: tool.description,
      totalTime: "PT1M",
      estimatedCost: {
        "@type": "MonetaryAmount",
        currency: "USD",
        value: "0",
      },
      supply: [],
      tool: [
        {
          "@type": "HowToTool",
          name: SITE_NAME,
        },
      ],
      step: tool.howToSteps.map((stepText, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: stepText.split(".")[0] ?? stepText,
        text: stepText,
        url: `${url}#step-${i + 1}`,
      })),
    });
  }

  /* 3. FAQPage (only when faqs exist) ─────────────────────────────── */
  if (tool.faqs && tool.faqs.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: tool.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    });
  }

  /* 4. BreadcrumbList ──────────────────────────────────────────────── */
  schemas.push({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${BASE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: categoryLabel,
        item: categoryUrl,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: tool.title,
        item: url,
      },
    ],
  });

  return schemas;
}

/* ─────────────────────────────────────────────────────────────────────────
   toolMetadata — generates all Next.js Metadata for every tool page
   ───────────────────────────────────────────────────────────────────────── */
export function toolMetadata(tool: ToolConfig): Metadata {
  // trailingSlash: true in next.config — canonical must include trailing slash
  const url = `${BASE_URL}${tool.slug}/`;

  const title       = `${tool.headline} | EasyConverter.io`;
  const description = tool.description;

  return {
    title,
    description,
    keywords: tool.keywords.join(", "),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type:     "website",
      locale:   "en_US",
      images: [
        {
          url:    OG_IMAGE,
          width:  1200,
          height: 630,
          alt:    `${tool.title} — EasyConverter.io`,
        },
      ],
    },
    twitter: {
      card:        "summary_large_image",
      title,
      description,
      images:      [OG_IMAGE],
      site:        "@easyconverterio",
      creator:     "@easyconverterio",
    },
    robots: {
      index:  true,
      follow: true,
      googleBot: {
        index:  true,
        follow: true,
        "max-snippet":       -1,
        "max-image-preview": "large",
      },
    },
  };
}

/* ─────────────────────────────────────────────────────────────────────────
   Category page metadata — one per category
   ───────────────────────────────────────────────────────────────────────── */

export const imagePageMetadata: Metadata = {
  title: "Free Online Image Converter Tools – JPG, PNG, WebP | EasyConverter.io",
  description:
    "Free online image converter tools. Convert JPG to PNG, PNG to JPG, compress images, resize images, convert to WebP, crop images. No upload required — 100% browser-based.",
  keywords: [
    "image converter online", "jpg to png converter", "png to jpg converter",
    "compress image online", "resize image online", "webp converter",
    "image to webp", "svg to png", "gif to png", "image cropper online",
    "free image converter",
  ].join(", "),
  alternates: { canonical: `${BASE_URL}/image/` },
  openGraph: {
    title:       "Free Online Image Converter Tools | EasyConverter.io",
    description: "12 free image tools: convert, compress, resize, and crop images in your browser. No upload required.",
    url:         `${BASE_URL}/image/`,
    siteName:    SITE_NAME,
    type:        "website",
    images:      [{ url: OG_IMAGE, width: 1200, height: 630, alt: "EasyConverter.io Image Tools" }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Free Image Converter Tools Online | EasyConverter.io",
    description: "12 free tools — convert, compress, resize, crop images. No upload, no account.",
    images:      [OG_IMAGE],
    site:        "@easyconverterio",
  },
};

export const pdfPageMetadata: Metadata = {
  title: "Free Online PDF Tools – Merge, Split, Compress, Convert | EasyConverter.io",
  description:
    "Free online PDF tools. Merge PDFs, split PDF, compress PDF, rotate pages, convert PDF to JPG/PNG, add watermarks and page numbers. No upload — 100% browser-based.",
  keywords: [
    "merge pdf", "split pdf", "compress pdf", "rotate pdf", "pdf to jpg",
    "pdf to png", "pdf tools online free", "word to pdf", "image to pdf",
    "pdf compressor", "pdf merger", "extract images from pdf",
  ].join(", "),
  alternates: { canonical: `${BASE_URL}/pdf/` },
  openGraph: {
    title:       "Free Online PDF Tools | EasyConverter.io",
    description: "14 free PDF tools — merge, split, compress, rotate, convert, watermark. No upload, no account.",
    url:         `${BASE_URL}/pdf/`,
    siteName:    SITE_NAME,
    type:        "website",
    images:      [{ url: OG_IMAGE, width: 1200, height: 630, alt: "EasyConverter.io PDF Tools" }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Free PDF Tools Online | EasyConverter.io",
    description: "Merge, split, compress PDFs and more — free, no upload, instant results.",
    images:      [OG_IMAGE],
    site:        "@easyconverterio",
  },
};

export const textPageMetadata: Metadata = {
  title: "Free Online Text Tools – Word Counter, Case Converter, Lorem Ipsum | EasyConverter.io",
  description:
    "Free online text tools. Count words, convert case, generate Lorem Ipsum, find and replace, sort lines, check readability, Markdown preview and more. No upload required.",
  keywords: [
    "word counter", "case converter", "lorem ipsum generator", "find and replace online",
    "line sorter", "text tools online free", "diff checker", "text to speech online free",
    "readability score", "markdown preview", "random text generator",
  ].join(", "),
  alternates: { canonical: `${BASE_URL}/text/` },
  openGraph: {
    title:       "Free Online Text Tools | EasyConverter.io",
    description: "13 free text tools — word counter, case converter, lorem ipsum, diff checker and more. No upload.",
    url:         `${BASE_URL}/text/`,
    siteName:    SITE_NAME,
    type:        "website",
    images:      [{ url: OG_IMAGE, width: 1200, height: 630, alt: "EasyConverter.io Text Tools" }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Free Text Tools Online | EasyConverter.io",
    description: "Word counter, case converter, lorem ipsum, diff checker — free, no upload.",
    images:      [OG_IMAGE],
    site:        "@easyconverterio",
  },
};

export const unitPageMetadata: Metadata = {
  title: "Free Online Unit Converter – Length, Weight, Temperature, Data | EasyConverter.io",
  description:
    "Free online unit converter. Convert length, weight, temperature, speed, data storage, area, volume, energy, pressure, and more. Instant results, no upload needed.",
  keywords: [
    "unit converter", "length converter", "weight converter", "temperature converter",
    "speed converter", "data storage converter", "area converter", "volume converter",
    "energy converter", "pressure converter", "online unit converter free",
  ].join(", "),
  alternates: { canonical: `${BASE_URL}/unit/` },
  openGraph: {
    title:       "Free Online Unit Converter | EasyConverter.io",
    description: "Convert length, weight, temperature, data, energy and more — 15 free unit converters.",
    url:         `${BASE_URL}/unit/`,
    siteName:    SITE_NAME,
    type:        "website",
    images:      [{ url: OG_IMAGE, width: 1200, height: 630, alt: "EasyConverter.io Unit Converters" }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Free Unit Converter Online | EasyConverter.io",
    description: "Convert any unit — length, weight, temperature, data and more. Free, instant, no upload.",
    images:      [OG_IMAGE],
    site:        "@easyconverterio",
  },
};

export const utilitiesPageMetadata: Metadata = {
  title: "Free Online Utility Tools – QR Code, Password, UUID, Base64 | EasyConverter.io",
  description:
    "Free online utility tools. Generate QR codes, strong passwords, UUIDs, Base64 encode/decode, URL encode, hash generator, regex tester, epoch converter, BMI, EMI, GST calculator.",
  keywords: [
    "qr code generator", "password generator", "uuid generator", "base64 encoder",
    "url encoder decoder", "hash generator", "regex tester", "epoch converter",
    "bmi calculator", "emi calculator", "gst calculator", "percentage calculator",
    "age calculator", "utility tools online free",
  ].join(", "),
  alternates: { canonical: `${BASE_URL}/utilities/` },
  openGraph: {
    title:       "Free Online Utility Tools | EasyConverter.io",
    description: "QR codes, passwords, UUIDs, Base64, regex, hash, epoch, BMI, EMI — 14 free utility tools.",
    url:         `${BASE_URL}/utilities/`,
    siteName:    SITE_NAME,
    type:        "website",
    images:      [{ url: OG_IMAGE, width: 1200, height: 630, alt: "EasyConverter.io Utilities" }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Free Utility Tools Online | EasyConverter.io",
    description: "QR code generator, password generator, UUID, Base64, hash and more — free, no upload.",
    images:      [OG_IMAGE],
    site:        "@easyconverterio",
  },
};

export const dataPageMetadata: Metadata = {
  title: "Free Online Data Converter Tools – JSON, CSV, XML, YAML | EasyConverter.io",
  description:
    "Free online data converter tools. Convert JSON, CSV, XML, YAML, TSV. Format, validate, diff, and transform data. JSON formatter, JSON validator, Excel to JSON and more.",
  keywords: [
    "json formatter", "json validator", "csv to json", "json to csv",
    "json to xml", "xml to json", "json to yaml", "yaml to json",
    "excel to json", "json diff", "json to typescript", "data converter online free",
  ].join(", "),
  alternates: { canonical: `${BASE_URL}/data/` },
  openGraph: {
    title:       "Free Online Data Converter Tools | EasyConverter.io",
    description: "JSON formatter, CSV to JSON, XML converter, YAML tools — 14 free data tools. No upload.",
    url:         `${BASE_URL}/data/`,
    siteName:    SITE_NAME,
    type:        "website",
    images:      [{ url: OG_IMAGE, width: 1200, height: 630, alt: "EasyConverter.io Data Tools" }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Free Data Converter Tools Online | EasyConverter.io",
    description: "JSON, CSV, XML, YAML — format, convert, validate data. Free, no upload.",
    images:      [OG_IMAGE],
    site:        "@easyconverterio",
  },
};

export const codePageMetadata: Metadata = {
  title: "Free Online Code Tools – HTML Formatter, CSS Minifier, JS Formatter | EasyConverter.io",
  description:
    "Free online code tools. Format HTML, CSS, JavaScript, SQL. Convert HTML to JSX, CSS to Tailwind, color converter, meta tags generator, robots.txt generator.",
  keywords: [
    "html formatter", "css formatter", "js formatter", "javascript formatter online",
    "html to jsx", "css to tailwind", "sql formatter", "color converter",
    "html entities encoder", "js obfuscator", "meta tags generator",
    "robots txt generator", "code tools online free",
  ].join(", "),
  alternates: { canonical: `${BASE_URL}/code/` },
  openGraph: {
    title:       "Free Online Code Tools | EasyConverter.io",
    description: "HTML, CSS, JS, SQL formatters, color converter, meta tags generator — 13 free dev tools.",
    url:         `${BASE_URL}/code/`,
    siteName:    SITE_NAME,
    type:        "website",
    images:      [{ url: OG_IMAGE, width: 1200, height: 630, alt: "EasyConverter.io Code Tools" }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Free Code Tools Online | EasyConverter.io",
    description: "Format HTML, CSS, JS, SQL. Convert colors, generate meta tags — free, no upload.",
    images:      [OG_IMAGE],
    site:        "@easyconverterio",
  },
};

export const documentPageMetadata: Metadata = {
  title: "Free Online Document Tools – HTML to PDF, DOCX to TXT | EasyConverter.io",
  description:
    "Free online document tools. Convert HTML to PDF, text to PDF, HTML to Markdown, count PDF pages, extract text from DOCX, flip and rotate images.",
  keywords: [
    "html to pdf", "text to pdf", "html to markdown", "markdown to html",
    "pdf page counter", "docx to txt", "word to text", "document converter online free",
    "image flip rotate online",
  ].join(", "),
  alternates: { canonical: `${BASE_URL}/document/` },
  openGraph: {
    title:       "Free Online Document Tools | EasyConverter.io",
    description: "HTML to PDF, text to PDF, Markdown converter, DOCX to TXT — 6 free document tools.",
    url:         `${BASE_URL}/document/`,
    siteName:    SITE_NAME,
    type:        "website",
    images:      [{ url: OG_IMAGE, width: 1200, height: 630, alt: "EasyConverter.io Document Tools" }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Free Document Converter Tools Online | EasyConverter.io",
    description: "HTML to PDF, DOCX to TXT, Markdown converter — free, no upload, instant.",
    images:      [OG_IMAGE],
    site:        "@easyconverterio",
  },
};

/* ─────────────────────────────────────────────────────────────────────────
   Homepage metadata
   ───────────────────────────────────────────────────────────────────────── */
export const homePageMetadata: Metadata = {
  title: "EasyConverter.io – Free Online File Converter | JPG, PNG, WebP, PDF",
  description:
    "100+ free online converter tools — images, PDFs, text, unit converters, data tools, and more. 100% browser-based, files never leave your device. No sign-up, no watermarks.",
  keywords: [
    "online file converter", "jpg to png", "png to jpg", "image converter online free",
    "compress image", "resize image", "convert to webp", "webp converter",
    "merge pdf", "compress pdf", "word to pdf", "free online converter",
    "no upload file converter", "browser based converter",
  ].join(", "),
  alternates: { canonical: `${BASE_URL}/` },
  openGraph: {
    title:       "EasyConverter.io – Free Online File Converter Tools",
    description:
      "100+ free online converter tools — images, PDFs, text, unit converters and more. 100% browser-based — files never leave your device.",
    url:         `${BASE_URL}/`,
    siteName:    SITE_NAME,
    type:        "website",
    locale:      "en_US",
    images:      [{ url: OG_IMAGE, width: 1200, height: 630, alt: "EasyConverter.io" }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "EasyConverter.io – Free Online File Converter Tools",
    description: "Convert images, PDFs, text and more — free, no upload, instant results.",
    images:      [OG_IMAGE],
    site:        "@easyconverterio",
    creator:     "@easyconverterio",
  },
};

import type { Metadata } from "next";
import type { ToolConfig } from "@/config/tools";

const BASE_URL = "https://easyconverter.io";
const OG_IMAGE = `${BASE_URL}/og-default.png`;
const SITE_NAME = "EasyConverter.io";

/**
 * Generates consistent, keyword-optimised metadata for every tool page.
 * Title pattern: "{keyword-rich headline} | EasyConverter.io"
 * Description: exact tool description (already optimised in tools.ts)
 */
export function toolMetadata(tool: ToolConfig): Metadata {
  const url = `${BASE_URL}${tool.slug}`;

  // Use headline as title because it's written as an exact-match query
  // e.g. "Convert JPG to PNG Free Online | EasyConverter.io"
  const title = `${tool.headline} | EasyConverter.io`;
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
      type: "website",
      locale: "en_US",
      images: [
        {
          url: OG_IMAGE,
          width: 1200,
          height: 630,
          alt: `${tool.title} — EasyConverter.io`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE],
      site: "@easyconverterio",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
      },
    },
  };
}

/** Metadata for the /image category page */
export const imagePageMetadata: Metadata = {
  title: "Free Online Image Converter Tools – JPG, PNG, WebP | EasyConverter.io",
  description:
    "Free online image converter tools. Convert JPG to PNG, PNG to JPG, compress images, resize images, convert to WebP, crop images. No upload required — 100% browser-based.",
  keywords: [
    "image converter online",
    "jpg to png converter",
    "png to jpg converter",
    "compress image online",
    "resize image online",
    "webp converter",
    "image to webp",
    "svg to png",
    "gif to png",
    "image cropper online",
    "free image converter",
  ].join(", "),
  alternates: { canonical: `${BASE_URL}/image` },
  openGraph: {
    title: "Free Online Image Converter Tools | EasyConverter.io",
    description: "12 free image tools: convert, compress, resize, and crop images in your browser. No upload required.",
    url: `${BASE_URL}/image`,
    siteName: SITE_NAME,
    type: "website",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "EasyConverter.io Image Tools" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Image Converter Tools Online | EasyConverter.io",
    description: "12 free tools — convert, compress, resize, crop images. No upload, no account.",
    images: [OG_IMAGE],
    site: "@easyconverterio",
  },
};

/** Metadata for the homepage */
export const homePageMetadata: Metadata = {
  title: "EasyConverter.io – Free Online File Converter | JPG, PNG, WebP, PDF",
  description:
    "Free online file converter tools. Convert JPG to PNG, PNG to JPG, compress images, resize photos, convert to WebP, crop images. 100% browser-based — files never leave your device.",
  keywords: [
    "online file converter",
    "jpg to png",
    "png to jpg",
    "image converter online free",
    "compress image",
    "resize image",
    "convert to webp",
    "webp converter",
    "svg to png",
    "image cropper",
    "free online converter",
    "no upload file converter",
  ].join(", "),
  alternates: { canonical: BASE_URL },
  openGraph: {
    title: "EasyConverter.io – Free Online File Converter Tools",
    description:
      "100+ free online file converter tools. Convert images, compress photos, resize images. 100% browser-based — files never leave your device.",
    url: BASE_URL,
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "EasyConverter.io" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "EasyConverter.io – Free Online File Converter Tools",
    description: "Convert images, PDFs, videos and more — free, no upload, instant results.",
    images: [OG_IMAGE],
    site: "@easyconverterio",
  },
};

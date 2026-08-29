import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicImageCompressor } from "@/components/tools/image/DynamicConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("image-compressor")!;

export const metadata: Metadata = {
  title: `${tool.title} – Reduce Image Size Free | EasyConverter.io`,
  description: tool.description,
  keywords: tool.keywords.join(", "),
  alternates: { canonical: `https://www.easyconverter.io${tool.slug}` },
  openGraph: {
    title: `${tool.title} – Free Online | EasyConverter.io`,
    description: tool.description,
    url: `https://www.easyconverter.io${tool.slug}`,
    siteName: "EasyConverter.io",
    type: "website",
    images: [{ url: "https://www.easyconverter.io/og-default.png", width: 1200, height: 630, alt: tool.title }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${tool.title} – Free Online`,
    description: tool.description,
    images: ["https://www.easyconverter.io/og-default.png"],
  },
};

export default function ImageCompressorPage() {
  return (
    <ToolPageShell tool={tool}>
      <DynamicImageCompressor />
    </ToolPageShell>
  );
}

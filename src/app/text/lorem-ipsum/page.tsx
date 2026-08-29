import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicLoremIpsum } from "@/components/tools/text/DynamicTextConverter";
import { getToolById } from "@/config/tools";

// Tool must exist in tools.ts — added separately
const tool = getToolById("lorem-ipsum")!;
export const metadata: Metadata = {
  title: "Lorem Ipsum Generator – Generate Placeholder Text Free Online | EasyConverter.io",
  description: "Generate Lorem Ipsum placeholder text online free. Choose paragraphs and sentence count. No upload needed.",
  alternates: { canonical: "https://www.easyconverter.io/text/lorem-ipsum/" },
  openGraph: { title: "Lorem Ipsum Generator – Generate Placeholder Text Free Online", description: "Generate Lorem Ipsum placeholder text online free. Choose paragraphs and sentence count. No upload needed.", url: "https://www.easyconverter.io/text/lorem-ipsum", siteName: "EasyConverter.io", type: "website" },
};

export default function LoremIpsumPage() {
  return (
    <ToolPageShell tool={tool}>
      <DynamicLoremIpsum />
    </ToolPageShell>
  );
}

import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicReadabilityScore } from "@/components/tools/text/DynamicTextConverter";
import { getToolById } from "@/config/tools";

// Tool must exist in tools.ts — added separately
const tool = getToolById("readability-score")!;
export const metadata: Metadata = {
  title: "Readability Score Checker – Flesch-Kincaid Online Free | EasyConverter.io",
  description: "Check the readability score of your text online free. Flesch-Kincaid grade level calculator.",
  alternates: { canonical: "https://www.easyconverter.io/text/readability-score" },
  openGraph: { title: "Readability Score Checker – Flesch-Kincaid Online Free", description: "Check the readability score of your text online free. Flesch-Kincaid grade level calculator.", url: "https://www.easyconverter.io/text/readability-score", siteName: "EasyConverter.io", type: "website" },
};

export default function ReadabilityPage() {
  return (
    <ToolPageShell tool={tool}>
      <DynamicReadabilityScore />
    </ToolPageShell>
  );
}

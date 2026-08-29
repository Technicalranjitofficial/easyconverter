import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicPlagiarismChecker } from "@/components/tools/text/DynamicTextConverter";
import { getToolById } from "@/config/tools";

// Tool must exist in tools.ts — added separately
const tool = getToolById("plagiarism-checker")!;
export const metadata: Metadata = {
  title: "Plagiarism Checker – Text Similarity Checker Online Free | EasyConverter.io",
  description: "Check text similarity and plagiarism online free. Compare two texts side by side. No upload needed.",
  alternates: { canonical: "https://www.easyconverter.io/text/plagiarism-checker" },
  openGraph: { title: "Plagiarism Checker – Text Similarity Checker Online Free", description: "Check text similarity and plagiarism online free. Compare two texts side by side. No upload needed.", url: "https://www.easyconverter.io/text/plagiarism-checker", siteName: "EasyConverter.io", type: "website" },
};

export default function PlagiarismPage() {
  return (
    <ToolPageShell tool={tool}>
      <DynamicPlagiarismChecker />
    </ToolPageShell>
  );
}

import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicDiffChecker } from "@/components/tools/text/DynamicTextConverter";
import { getToolById } from "@/config/tools";

// Tool must exist in tools.ts — added separately
const tool = getToolById("diff-checker")!;
export const metadata: Metadata = {
  title: "Text Diff Checker – Compare Two Texts Online Free | EasyConverter.io",
  description: "Compare two texts and see the differences highlighted online free. No upload needed.",
  alternates: { canonical: "https://www.easyconverter.io/text/diff-checker/" },
  openGraph: { title: "Text Diff Checker – Compare Two Texts Online Free", description: "Compare two texts and see the differences highlighted online free. No upload needed.", url: "https://www.easyconverter.io/text/diff-checker", siteName: "EasyConverter.io", type: "website" },
};

export default function DiffCheckerPage() {
  return (
    <ToolPageShell tool={tool}>
      <DynamicDiffChecker />
    </ToolPageShell>
  );
}

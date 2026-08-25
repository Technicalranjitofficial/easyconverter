import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicDeduplicateLines } from "@/components/tools/text/DynamicTextConverter";
import { getToolById } from "@/config/tools";

// Tool must exist in tools.ts — added separately
const tool = getToolById("deduplicate-lines")!;
export const metadata: Metadata = {
  title: "Remove Duplicate Lines Online Free | EasyConverter.io",
  description: "Remove duplicate lines from text online for free. Case-sensitive option. No upload needed.",
  alternates: { canonical: "https://easyconverter.io/text/deduplicate-lines" },
  openGraph: { title: "Remove Duplicate Lines Online Free", description: "Remove duplicate lines from text online for free. Case-sensitive option. No upload needed.", url: "https://easyconverter.io/text/deduplicate-lines", siteName: "EasyConverter.io", type: "website" },
};

export default function DeduplicatePage() {
  return (
    <ToolPageShell tool={tool}>
      <DynamicDeduplicateLines />
    </ToolPageShell>
  );
}

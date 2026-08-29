import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicFindReplace } from "@/components/tools/text/DynamicTextConverter";
import { getToolById } from "@/config/tools";

// Tool must exist in tools.ts — added separately
const tool = getToolById("find-replace")!;
export const metadata: Metadata = {
  title: "Find and Replace Text Online – Free Text Find & Replace Tool | EasyConverter.io",
  description: "Find and replace text online for free. Supports regex, case-sensitive matching. No upload needed.",
  alternates: { canonical: "https://www.easyconverter.io/text/find-replace/" },
  openGraph: { title: "Find and Replace Text Online – Free Text Find & Replace Tool", description: "Find and replace text online for free. Supports regex, case-sensitive matching. No upload needed.", url: "https://www.easyconverter.io/text/find-replace", siteName: "EasyConverter.io", type: "website" },
};

export default function FindReplacePage() {
  return (
    <ToolPageShell tool={tool}>
      <DynamicFindReplace />
    </ToolPageShell>
  );
}

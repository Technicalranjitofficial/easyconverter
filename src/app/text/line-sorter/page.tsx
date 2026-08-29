import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicLineSorter } from "@/components/tools/text/DynamicTextConverter";
import { getToolById } from "@/config/tools";

// Tool must exist in tools.ts — added separately
const tool = getToolById("line-sorter")!;
export const metadata: Metadata = {
  title: "Line Sorter – Sort Lines Alphabetically Online Free | EasyConverter.io",
  description: "Sort lines A-Z, Z-A, by length or shuffle. Free online line sorting tool. No upload needed.",
  alternates: { canonical: "https://www.easyconverter.io/text/line-sorter" },
  openGraph: { title: "Line Sorter – Sort Lines Alphabetically Online Free", description: "Sort lines A-Z, Z-A, by length or shuffle. Free online line sorting tool. No upload needed.", url: "https://www.easyconverter.io/text/line-sorter", siteName: "EasyConverter.io", type: "website" },
};

export default function LineSorterPage() {
  return (
    <ToolPageShell tool={tool}>
      <DynamicLineSorter />
    </ToolPageShell>
  );
}

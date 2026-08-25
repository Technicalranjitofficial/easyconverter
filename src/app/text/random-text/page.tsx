import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicRandomText } from "@/components/tools/text/DynamicTextConverter";
import { getToolById } from "@/config/tools";

// Tool must exist in tools.ts — added separately
const tool = getToolById("random-text")!;
export const metadata: Metadata = {
  title: "Random Text Generator – Generate Random Words Online Free | EasyConverter.io",
  description: "Generate random text online for free. Set word count. No upload needed.",
  alternates: { canonical: "https://easyconverter.io/text/random-text" },
  openGraph: { title: "Random Text Generator – Generate Random Words Online Free", description: "Generate random text online for free. Set word count. No upload needed.", url: "https://easyconverter.io/text/random-text", siteName: "EasyConverter.io", type: "website" },
};

export default function RandomTextPage() {
  return (
    <ToolPageShell tool={tool}>
      <DynamicRandomText />
    </ToolPageShell>
  );
}

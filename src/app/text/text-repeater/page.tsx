import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicTextRepeater } from "@/components/tools/text/DynamicTextConverter";
import { getToolById } from "@/config/tools";

// Tool must exist in tools.ts — added separately
const tool = getToolById("text-repeater")!;
export const metadata: Metadata = {
  title: "Text Repeater – Repeat Text Online Free | EasyConverter.io",
  description: "Repeat any text N times online for free. Choose separator. No upload needed.",
  alternates: { canonical: "https://www.easyconverter.io/text/text-repeater/" },
  openGraph: { title: "Text Repeater – Repeat Text Online Free", description: "Repeat any text N times online for free. Choose separator. No upload needed.", url: "https://www.easyconverter.io/text/text-repeater", siteName: "EasyConverter.io", type: "website" },
};

export default function TextRepeaterPage() {
  return (
    <ToolPageShell tool={tool}>
      <DynamicTextRepeater />
    </ToolPageShell>
  );
}

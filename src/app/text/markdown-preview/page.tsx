import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicMarkdownPreview } from "@/components/tools/text/DynamicTextConverter";
import { getToolById } from "@/config/tools";

// Tool must exist in tools.ts — added separately
const tool = getToolById("markdown-preview")!;
export const metadata: Metadata = {
  title: "Markdown Preview – Live Markdown Editor Online Free | EasyConverter.io",
  description: "Preview Markdown in real time online for free. No upload needed, runs in your browser.",
  alternates: { canonical: "https://www.easyconverter.io/text/markdown-preview" },
  openGraph: { title: "Markdown Preview – Live Markdown Editor Online Free", description: "Preview Markdown in real time online for free. No upload needed, runs in your browser.", url: "https://www.easyconverter.io/text/markdown-preview", siteName: "EasyConverter.io", type: "website" },
};

export default function MarkdownPreviewPage() {
  return (
    <ToolPageShell tool={tool}>
      <DynamicMarkdownPreview />
    </ToolPageShell>
  );
}

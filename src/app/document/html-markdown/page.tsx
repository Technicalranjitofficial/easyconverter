import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicHtmlMarkdownConverter } from "@/components/tools/document/DynamicDocumentConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("doc-html-markdown")!;
export const metadata: Metadata = { title: "HTML ↔ Markdown Converter – Free Online | EasyConverter.io", description: "Convert HTML to Markdown or Markdown to HTML online free.", alternates: { canonical: "https://www.easyconverter.io/document/html-markdown/" } };

export default function HtmlMarkdownConverterPage() {
  return <ToolPageShell tool={tool}><DynamicHtmlMarkdownConverter /></ToolPageShell>;
}

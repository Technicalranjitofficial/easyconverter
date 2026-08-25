import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicHtmlToPdf } from "@/components/tools/document/DynamicDocumentConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("doc-html-to-pdf")!;
export const metadata: Metadata = { title: "HTML to PDF Converter – Free Online | EasyConverter.io", description: "Convert HTML to PDF online free using the browser print engine. No upload.", alternates: { canonical: "https://easyconverter.io/document/html-to-pdf" } };

export default function HtmlToPdfPage() {
  return <ToolPageShell tool={tool}><DynamicHtmlToPdf /></ToolPageShell>;
}

import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicTextToPdf } from "@/components/tools/document/DynamicDocumentConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("doc-text-to-pdf")!;
export const metadata: Metadata = { title: "Text to PDF – Convert Plain Text to PDF Free | EasyConverter.io", description: "Convert plain text to PDF with custom font size and margins. Free online.", alternates: { canonical: "https://easyconverter.io/document/text-to-pdf" } };

export default function TextToPdfPage() {
  return <ToolPageShell tool={tool}><DynamicTextToPdf /></ToolPageShell>;
}

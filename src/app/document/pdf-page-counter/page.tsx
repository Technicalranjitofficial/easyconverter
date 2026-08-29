import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicPdfPageCounter } from "@/components/tools/document/DynamicDocumentConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("doc-pdf-page-counter")!;
export const metadata: Metadata = { title: "PDF Page Counter – Count PDF Pages Online Free | EasyConverter.io", description: "Count the number of pages in a PDF file online free. No upload needed.", alternates: { canonical: "https://www.easyconverter.io/document/pdf-page-counter/" } };

export default function PdfPageCounterPage() {
  return <ToolPageShell tool={tool}><DynamicPdfPageCounter /></ToolPageShell>;
}

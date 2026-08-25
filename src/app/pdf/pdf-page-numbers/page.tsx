import type { Metadata } from "next";
import { toolMetadata } from "@/lib/seo";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicPdfPageNumbers } from "@/components/tools/pdf/DynamicPdfConverter";
import { getToolById } from "@/config/tools";
const tool = getToolById("pdf-page-numbers")!;
export const metadata: Metadata = toolMetadata(tool);
export default function PdfPageNumbersPage() {
  return <ToolPageShell tool={tool}><DynamicPdfPageNumbers /></ToolPageShell>;
}

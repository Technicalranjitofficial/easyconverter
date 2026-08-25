import type { Metadata } from "next";
import { toolMetadata } from "@/lib/seo";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicPdfToText } from "@/components/tools/pdf/DynamicPdfConverter";
import { getToolById } from "@/config/tools";
const tool = getToolById("pdf-to-text")!;
export const metadata: Metadata = toolMetadata(tool);
export default function PdfToTextPage() {
  return <ToolPageShell tool={tool}><DynamicPdfToText /></ToolPageShell>;
}

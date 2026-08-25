import type { Metadata } from "next";
import { toolMetadata } from "@/lib/seo";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicPdfWatermark } from "@/components/tools/pdf/DynamicPdfConverter";
import { getToolById } from "@/config/tools";
const tool = getToolById("pdf-watermark")!;
export const metadata: Metadata = toolMetadata(tool);
export default function PdfWatermarkPage() {
  return <ToolPageShell tool={tool}><DynamicPdfWatermark /></ToolPageShell>;
}

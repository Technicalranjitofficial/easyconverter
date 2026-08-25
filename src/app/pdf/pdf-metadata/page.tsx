import type { Metadata } from "next";
import { toolMetadata } from "@/lib/seo";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicPdfMetadata } from "@/components/tools/pdf/DynamicPdfConverter";
import { getToolById } from "@/config/tools";
const tool = getToolById("pdf-metadata")!;
export const metadata: Metadata = toolMetadata(tool);
export default function PdfMetadataPage() {
  return <ToolPageShell tool={tool}><DynamicPdfMetadata /></ToolPageShell>;
}

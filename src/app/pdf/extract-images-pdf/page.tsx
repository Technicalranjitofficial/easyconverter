import type { Metadata } from "next";
import { toolMetadata } from "@/lib/seo";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicPdfExtractImages } from "@/components/tools/pdf/DynamicPdfConverter";
import { getToolById } from "@/config/tools";
const tool = getToolById("extract-images-pdf")!;
export const metadata: Metadata = toolMetadata(tool);
export default function ExtractImagesPdfPage() {
  return <ToolPageShell tool={tool}><DynamicPdfExtractImages /></ToolPageShell>;
}

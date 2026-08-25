import type { Metadata } from "next";
import { toolMetadata } from "@/lib/seo";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicPdfRotate } from "@/components/tools/pdf/DynamicPdfConverter";
import { getToolById } from "@/config/tools";
const tool = getToolById("rotate-pdf")!;
export const metadata: Metadata = toolMetadata(tool);
export default function RotatePdfPage() {
  return <ToolPageShell tool={tool}><DynamicPdfRotate /></ToolPageShell>;
}

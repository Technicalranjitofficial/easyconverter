import type { Metadata } from "next";
import { toolMetadata } from "@/lib/seo";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicPdfReorder } from "@/components/tools/pdf/DynamicPdfConverter";
import { getToolById } from "@/config/tools";
const tool = getToolById("reorder-pdf")!;
export const metadata: Metadata = toolMetadata(tool);
export default function ReorderPdfPage() {
  return <ToolPageShell tool={tool}><DynamicPdfReorder /></ToolPageShell>;
}

import type { Metadata } from "next";
import { toolMetadata } from "@/lib/seo";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicPdfMerge } from "@/components/tools/pdf/DynamicPdfConverter";
import { getToolById } from "@/config/tools";
const tool = getToolById("merge-pdf")!;
export const metadata: Metadata = toolMetadata(tool);
export default function MergePdfPage() {
  return <ToolPageShell tool={tool}><DynamicPdfMerge /></ToolPageShell>;
}

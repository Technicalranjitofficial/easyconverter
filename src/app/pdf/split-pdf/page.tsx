import type { Metadata } from "next";
import { toolMetadata } from "@/lib/seo";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicPdfSplit } from "@/components/tools/pdf/DynamicPdfConverter";
import { getToolById } from "@/config/tools";
const tool = getToolById("split-pdf")!;
export const metadata: Metadata = toolMetadata(tool);
export default function SplitPdfPage() {
  return <ToolPageShell tool={tool}><DynamicPdfSplit /></ToolPageShell>;
}

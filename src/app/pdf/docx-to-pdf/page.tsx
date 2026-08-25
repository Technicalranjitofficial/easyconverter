import type { Metadata } from "next";
import { toolMetadata } from "@/lib/seo";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicDocxToPdf } from "@/components/tools/pdf/DynamicPdfConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("docx-to-pdf")!;
export const metadata: Metadata = toolMetadata(tool);

export default function DocxToPdfPage() {
  return (
    <ToolPageShell tool={tool}>
      <DynamicDocxToPdf />
    </ToolPageShell>
  );
}

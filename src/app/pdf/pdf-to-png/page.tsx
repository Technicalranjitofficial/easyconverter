import type { Metadata } from "next";
import { toolMetadata } from "@/lib/seo";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicPdfToPng } from "@/components/tools/pdf/DynamicPdfConverter";
import { getToolById } from "@/config/tools";
const tool = getToolById("pdf-to-png")!;
export const metadata: Metadata = toolMetadata(tool);
export default function PdfToPngPage() {
  return (
    <ToolPageShell tool={tool}>
      <DynamicPdfToPng outputFormat="image/png" outputExt="png" />
    </ToolPageShell>
  );
}

import type { Metadata } from "next";
import { toolMetadata } from "@/lib/seo";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicPdfToJpg } from "@/components/tools/pdf/DynamicPdfConverter";
import { getToolById } from "@/config/tools";
const tool = getToolById("pdf-to-jpg")!;
export const metadata: Metadata = toolMetadata(tool);
export default function PdfToJpgPage() {
  return (
    <ToolPageShell tool={tool}>
      <DynamicPdfToJpg outputFormat="image/jpeg" outputExt="jpg" />
    </ToolPageShell>
  );
}

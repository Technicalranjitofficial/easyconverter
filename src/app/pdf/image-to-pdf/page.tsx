import type { Metadata } from "next";
import { toolMetadata } from "@/lib/seo";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicPdfImageToPdf } from "@/components/tools/pdf/DynamicPdfConverter";
import { getToolById } from "@/config/tools";
const tool = getToolById("image-to-pdf")!;
export const metadata: Metadata = toolMetadata(tool);
export default function ImageToPdfPage() {
  return <ToolPageShell tool={tool}><DynamicPdfImageToPdf /></ToolPageShell>;
}

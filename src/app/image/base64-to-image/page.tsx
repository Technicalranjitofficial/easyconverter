import type { Metadata } from "next";
import { toolMetadata } from "@/lib/seo";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicBase64ToImage } from "@/components/tools/image/DynamicConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("base64-to-image")!;
export const metadata: Metadata = toolMetadata(tool);

export default function Base64ToImagePage() {
  return (
    <ToolPageShell tool={tool}>
      <DynamicBase64ToImage />
    </ToolPageShell>
  );
}

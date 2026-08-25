import type { Metadata } from "next";
import { toolMetadata } from "@/lib/seo";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicImageBase64Converter } from "@/components/tools/image/DynamicConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("image-to-base64")!;
export const metadata: Metadata = toolMetadata(tool);

export default function ImageToBase64Page() {
  return (
    <ToolPageShell tool={tool}>
      <DynamicImageBase64Converter />
    </ToolPageShell>
  );
}

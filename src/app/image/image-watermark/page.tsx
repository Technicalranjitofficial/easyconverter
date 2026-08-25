import type { Metadata } from "next";
import { toolMetadata } from "@/lib/seo";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicImageWatermark } from "@/components/tools/image/DynamicConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("image-watermark")!;
export const metadata: Metadata = toolMetadata(tool);

export default function ImageWatermarkPage() {
  return (
    <ToolPageShell tool={tool}>
      <DynamicImageWatermark />
    </ToolPageShell>
  );
}

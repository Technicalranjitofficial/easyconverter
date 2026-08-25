import type { Metadata } from "next";
import { toolMetadata } from "@/lib/seo";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicImageCropper } from "@/components/tools/image/DynamicConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("image-cropper")!;

export const metadata: Metadata = toolMetadata(tool);

export default function ImageCropperPage() {
  return (
    <ToolPageShell tool={tool}>
      <DynamicImageCropper />
    </ToolPageShell>
  );
}

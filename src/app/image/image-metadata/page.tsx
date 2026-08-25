import type { Metadata } from "next";
import { toolMetadata } from "@/lib/seo";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicImageMetadata } from "@/components/tools/image/DynamicConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("image-metadata")!;
export const metadata: Metadata = toolMetadata(tool);

export default function ImageMetadataPage() {
  return (
    <ToolPageShell tool={tool}>
      <DynamicImageMetadata />
    </ToolPageShell>
  );
}

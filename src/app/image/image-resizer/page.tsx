import type { Metadata } from "next";
import { toolMetadata } from "@/lib/seo";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicImageResizer } from "@/components/tools/image/DynamicConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("image-resizer")!;

export const metadata: Metadata = toolMetadata(tool);

export default function ImageResizerPage() {
  return (
    <ToolPageShell tool={tool}>
      <DynamicImageResizer />
    </ToolPageShell>
  );
}

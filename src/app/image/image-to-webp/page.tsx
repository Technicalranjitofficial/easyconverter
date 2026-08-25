import type { Metadata } from "next";
import { toolMetadata } from "@/lib/seo";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicImageConverterCore } from "@/components/tools/image/DynamicConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("image-to-webp")!;

export const metadata: Metadata = toolMetadata(tool);

export default function ImageToWebpPage() {
  return (
    <ToolPageShell tool={tool}>
      <DynamicImageConverterCore
        outputFormat="image/webp"
        outputExtension="webp"
        acceptedTypes={["image/jpeg", "image/png", "image/gif"]}
        quality={0.85}
        maxFileSizeMB={tool.maxFileSizeMB}
        maxBatchSize={tool.maxBatchSize}
      />
    </ToolPageShell>
  );
}

import type { Metadata } from "next";
import { toolMetadata } from "@/lib/seo";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicImageConverterCore } from "@/components/tools/image/DynamicConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("png-to-webp")!;

export const metadata: Metadata = toolMetadata(tool);

export default function PngToWebpPage() {
  return (
    <ToolPageShell tool={tool}>
      <DynamicImageConverterCore
        outputFormat="image/webp"
        outputExtension="webp"
        acceptedTypes={["image/png"]}
        maxFileSizeMB={tool.maxFileSizeMB}
        maxBatchSize={tool.maxBatchSize}
        quality={0.85}
      />
    </ToolPageShell>
  );
}

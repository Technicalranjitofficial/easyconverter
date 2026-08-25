import type { Metadata } from "next";
import { toolMetadata } from "@/lib/seo";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicImageConverterCore } from "@/components/tools/image/DynamicConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("gif-to-png")!;

export const metadata: Metadata = toolMetadata(tool);

export default function GifToPngPage() {
  return (
    <ToolPageShell tool={tool}>
      <DynamicImageConverterCore
        outputFormat="image/png"
        outputExtension="png"
        acceptedTypes={["image/gif"]}
        maxFileSizeMB={tool.maxFileSizeMB}
        maxBatchSize={tool.maxBatchSize}
        actionLabel="Extract first frame as PNG"
      />
    </ToolPageShell>
  );
}

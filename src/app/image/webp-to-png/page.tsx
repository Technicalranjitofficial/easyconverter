import type { Metadata } from "next";
import { toolMetadata } from "@/lib/seo";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicImageConverterCore } from "@/components/tools/image/DynamicConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("webp-to-png")!;

export const metadata: Metadata = toolMetadata(tool);

export default function WebpToPngPage() {
  return (
    <ToolPageShell tool={tool}>
      <DynamicImageConverterCore
        outputFormat="image/png"
        outputExtension="png"
        acceptedTypes={["image/webp"]}
        maxFileSizeMB={tool.maxFileSizeMB}
        maxBatchSize={tool.maxBatchSize}
      />
    </ToolPageShell>
  );
}

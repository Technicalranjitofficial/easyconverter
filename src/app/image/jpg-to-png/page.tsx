import type { Metadata } from "next";
import { toolMetadata } from "@/lib/seo";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicImageConverterCore } from "@/components/tools/image/DynamicConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("jpg-to-png")!;

export const metadata: Metadata = toolMetadata(tool);

export default function JpgToPngPage() {
  return (
    <ToolPageShell tool={tool}>
      <DynamicImageConverterCore
        outputFormat="image/png"
        outputExtension="png"
        acceptedTypes={["image/jpeg"]}
        maxFileSizeMB={tool.maxFileSizeMB}
        maxBatchSize={tool.maxBatchSize}
      />
    </ToolPageShell>
  );
}

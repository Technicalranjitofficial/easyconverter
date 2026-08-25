import type { Metadata } from "next";
import { toolMetadata } from "@/lib/seo";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicImageConverterCore } from "@/components/tools/image/DynamicConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("png-to-jpg")!;

export const metadata: Metadata = toolMetadata(tool);

export default function PngToJpgPage() {
  return (
    <ToolPageShell tool={tool}>
      <DynamicImageConverterCore
        outputFormat="image/jpeg"
        outputExtension="jpg"
        acceptedTypes={["image/png"]}
        quality={0.92}
        maxFileSizeMB={tool.maxFileSizeMB}
        maxBatchSize={tool.maxBatchSize}
      />
    </ToolPageShell>
  );
}

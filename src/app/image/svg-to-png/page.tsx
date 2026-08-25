import type { Metadata } from "next";
import { toolMetadata } from "@/lib/seo";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicImageSvgConverter } from "@/components/tools/image/DynamicConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("svg-to-png")!;

export const metadata: Metadata = toolMetadata(tool);

export default function SvgToPngPage() {
  return (
    <ToolPageShell tool={tool}>
      <DynamicImageSvgConverter />
    </ToolPageShell>
  );
}

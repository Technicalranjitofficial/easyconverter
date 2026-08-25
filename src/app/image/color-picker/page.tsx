import type { Metadata } from "next";
import { toolMetadata } from "@/lib/seo";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicColorPicker } from "@/components/tools/image/DynamicConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("color-picker")!;
export const metadata: Metadata = toolMetadata(tool);

export default function ColorPickerPage() {
  return (
    <ToolPageShell tool={tool}>
      <DynamicColorPicker />
    </ToolPageShell>
  );
}

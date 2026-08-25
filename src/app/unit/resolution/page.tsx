import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicResolutionConverter } from "@/components/tools/unit/DynamicUnitConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("unit-resolution")!;
export const metadata: Metadata = {
  title: "Resolution Converter – PPI, DPI, PPCM Online Free | EasyConverter.io",
  description: "Convert image resolution: PPI, DPI, PPCM, dots/mm. Free online resolution converter.",
  alternates: { canonical: "https://easyconverter.io/unit/resolution" },
};

export default function ResolutionConverterPage() {
  return (
    <ToolPageShell tool={tool}>
      <DynamicResolutionConverter />
    </ToolPageShell>
  );
}

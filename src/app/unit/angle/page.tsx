import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicAngleConverter } from "@/components/tools/unit/DynamicUnitConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("unit-angle")!;
export const metadata: Metadata = {
  title: "Angle Converter – Degrees, Radians, Gradians Online | EasyConverter.io",
  description: "Convert angles: degrees, radians, gradians, arcminutes, arcseconds. Free online angle converter.",
  alternates: { canonical: "https://www.easyconverter.io/unit/angle" },
};

export default function AngleConverterPage() {
  return (
    <ToolPageShell tool={tool}>
      <DynamicAngleConverter />
    </ToolPageShell>
  );
}

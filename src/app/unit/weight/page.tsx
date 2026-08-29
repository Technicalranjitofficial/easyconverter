import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicWeightConverter } from "@/components/tools/unit/DynamicUnitConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("unit-weight")!;
export const metadata: Metadata = {
  title: "Weight Converter – kg, lbs, oz, Grams Online Free | EasyConverter.io",
  description: "Convert weight units: kg, pounds, ounces, grams, tons and more. Free online weight converter.",
  alternates: { canonical: "https://www.easyconverter.io/unit/weight/" },
};

export default function WeightConverterPage() {
  return (
    <ToolPageShell tool={tool}>
      <DynamicWeightConverter />
    </ToolPageShell>
  );
}

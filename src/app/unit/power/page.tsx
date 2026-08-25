import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicPowerConverter } from "@/components/tools/unit/DynamicUnitConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("unit-power")!;
export const metadata: Metadata = {
  title: "Power Converter – Watts, kW, Horsepower Online Free | EasyConverter.io",
  description: "Convert power units: watts, kilowatts, horsepower, BTU/hour. Free online power converter.",
  alternates: { canonical: "https://easyconverter.io/unit/power" },
};

export default function PowerConverterPage() {
  return (
    <ToolPageShell tool={tool}>
      <DynamicPowerConverter />
    </ToolPageShell>
  );
}

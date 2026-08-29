import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicEnergyConverter } from "@/components/tools/unit/DynamicUnitConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("unit-energy")!;
export const metadata: Metadata = {
  title: "Energy Converter – Joules, Calories, kWh, BTU Free | EasyConverter.io",
  description: "Convert energy units: joules, calories, kWh, BTU and more. Free online energy converter.",
  alternates: { canonical: "https://www.easyconverter.io/unit/energy/" },
};

export default function EnergyConverterPage() {
  return (
    <ToolPageShell tool={tool}>
      <DynamicEnergyConverter />
    </ToolPageShell>
  );
}

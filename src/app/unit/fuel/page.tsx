import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicFuelConverter } from "@/components/tools/unit/DynamicUnitConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("unit-fuel")!;
export const metadata: Metadata = {
  title: "Fuel Economy Converter – MPG, km/L, L/100km Free | EasyConverter.io",
  description: "Convert fuel economy: MPG to km/L, L/100km and more. Free online fuel economy converter.",
  alternates: { canonical: "https://easyconverter.io/unit/fuel" },
};

export default function FuelConverterPage() {
  return (
    <ToolPageShell tool={tool}>
      <DynamicFuelConverter />
    </ToolPageShell>
  );
}

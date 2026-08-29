import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicPressureConverter } from "@/components/tools/unit/DynamicUnitConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("unit-pressure")!;
export const metadata: Metadata = {
  title: "Pressure Converter – PSI, Bar, Pascal, ATM Online | EasyConverter.io",
  description: "Convert pressure units: PSI, bar, pascal, atm, kPa and more. Free online pressure converter.",
  alternates: { canonical: "https://www.easyconverter.io/unit/pressure/" },
};

export default function PressureConverterPage() {
  return (
    <ToolPageShell tool={tool}>
      <DynamicPressureConverter />
    </ToolPageShell>
  );
}

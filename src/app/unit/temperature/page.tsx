import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicTemperatureConverter } from "@/components/tools/unit/DynamicUnitConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("unit-temperature")!;
export const metadata: Metadata = {
  title: "Temperature Converter – °C, °F, Kelvin Online Free | EasyConverter.io",
  description: "Convert temperature: Celsius to Fahrenheit, Kelvin and more. Free online temperature converter.",
  alternates: { canonical: "https://www.easyconverter.io/unit/temperature" },
};

export default function TemperatureConverterPage() {
  return (
    <ToolPageShell tool={tool}>
      <DynamicTemperatureConverter />
    </ToolPageShell>
  );
}

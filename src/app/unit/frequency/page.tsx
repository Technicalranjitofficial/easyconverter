import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicFrequencyConverter } from "@/components/tools/unit/DynamicUnitConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("unit-frequency")!;
export const metadata: Metadata = {
  title: "Frequency Converter – Hz, kHz, MHz, GHz Online Free | EasyConverter.io",
  description: "Convert frequency units: Hz, kHz, MHz, GHz, RPM. Free online frequency converter.",
  alternates: { canonical: "https://www.easyconverter.io/unit/frequency" },
};

export default function FrequencyConverterPage() {
  return (
    <ToolPageShell tool={tool}>
      <DynamicFrequencyConverter />
    </ToolPageShell>
  );
}

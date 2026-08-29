import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicLengthConverter } from "@/components/tools/unit/DynamicUnitConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("unit-length")!;
export const metadata: Metadata = {
  title: "Length Converter – Free Online Unit Converter | EasyConverter.io",
  description: "Convert length units: metres, km, miles, feet, inches, cm and more. Free online length converter.",
  alternates: { canonical: "https://www.easyconverter.io/unit/length" },
};

export default function LengthConverterPage() {
  return (
    <ToolPageShell tool={tool}>
      <DynamicLengthConverter />
    </ToolPageShell>
  );
}

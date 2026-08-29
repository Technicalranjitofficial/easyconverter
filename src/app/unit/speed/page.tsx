import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicSpeedConverter } from "@/components/tools/unit/DynamicUnitConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("unit-speed")!;
export const metadata: Metadata = {
  title: "Speed Converter – km/h, mph, m/s Online Free | EasyConverter.io",
  description: "Convert speed units: km/h, mph, m/s, knots and more. Free online speed converter.",
  alternates: { canonical: "https://www.easyconverter.io/unit/speed/" },
};

export default function SpeedConverterPage() {
  return (
    <ToolPageShell tool={tool}>
      <DynamicSpeedConverter />
    </ToolPageShell>
  );
}

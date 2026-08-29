import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicVolumeConverter } from "@/components/tools/unit/DynamicUnitConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("unit-volume")!;
export const metadata: Metadata = {
  title: "Volume Converter – Litres, Gallons, ml, Cups Online | EasyConverter.io",
  description: "Convert volume units: litres, gallons, ml, cups, cubic metres. Free online volume converter.",
  alternates: { canonical: "https://www.easyconverter.io/unit/volume" },
};

export default function VolumeConverterPage() {
  return (
    <ToolPageShell tool={tool}>
      <DynamicVolumeConverter />
    </ToolPageShell>
  );
}

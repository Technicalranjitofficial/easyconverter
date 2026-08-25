import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicAreaConverter } from "@/components/tools/unit/DynamicUnitConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("unit-area")!;
export const metadata: Metadata = {
  title: "Area Converter – sq ft, sq m, acres, hectares Free | EasyConverter.io",
  description: "Convert area units: sq metres, sq feet, acres, hectares and more. Free online area converter.",
  alternates: { canonical: "https://easyconverter.io/unit/area" },
};

export default function AreaConverterPage() {
  return (
    <ToolPageShell tool={tool}>
      <DynamicAreaConverter />
    </ToolPageShell>
  );
}

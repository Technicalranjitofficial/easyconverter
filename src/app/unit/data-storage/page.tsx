import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicDataStorageConverter } from "@/components/tools/unit/DynamicUnitConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("unit-data-storage")!;
export const metadata: Metadata = {
  title: "Data Storage Converter – KB, MB, GB, TB Online Free | EasyConverter.io",
  description: "Convert data storage units: bits, bytes, KB, MB, GB, TB, PB. Free online data storage converter.",
  alternates: { canonical: "https://www.easyconverter.io/unit/data-storage" },
};

export default function DataStorageConverterPage() {
  return (
    <ToolPageShell tool={tool}>
      <DynamicDataStorageConverter />
    </ToolPageShell>
  );
}

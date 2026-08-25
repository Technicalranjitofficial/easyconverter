import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicTimeConverter } from "@/components/tools/unit/DynamicUnitConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("unit-time")!;
export const metadata: Metadata = {
  title: "Time Converter – Seconds, Minutes, Hours, Days Online | EasyConverter.io",
  description: "Convert time units: seconds, minutes, hours, days, weeks, months, years. Free online time converter.",
  alternates: { canonical: "https://easyconverter.io/unit/time" },
};

export default function TimeConverterPage() {
  return (
    <ToolPageShell tool={tool}>
      <DynamicTimeConverter />
    </ToolPageShell>
  );
}

import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicPercentageCalculator } from "@/components/tools/utility/DynamicUtilityConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("util-percentage")!;
export const metadata: Metadata = { title: "Percentage Calculator – Free Online | EasyConverter.io", description: "Calculate percentages: of a number, change, increase/decrease.", alternates: { canonical: "https://www.easyconverter.io/utilities/percentage/" } };

export default function PercentageCalculatorPage() {
  return <ToolPageShell tool={tool}><DynamicPercentageCalculator /></ToolPageShell>;
}

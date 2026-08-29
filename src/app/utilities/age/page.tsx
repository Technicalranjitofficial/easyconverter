import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicAgeCalculator } from "@/components/tools/utility/DynamicUtilityConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("util-age")!;
export const metadata: Metadata = { title: "Age Calculator – Calculate Age from Birth Date | EasyConverter.io", description: "Calculate exact age in years months days from date of birth.", alternates: { canonical: "https://www.easyconverter.io/utilities/age/" } };

export default function AgeCalculatorPage() {
  return <ToolPageShell tool={tool}><DynamicAgeCalculator /></ToolPageShell>;
}

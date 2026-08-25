import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicBmiCalculator } from "@/components/tools/utility/DynamicUtilityConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("util-bmi")!;
export const metadata: Metadata = { title: "BMI Calculator – Body Mass Index Online Free | EasyConverter.io", description: "Calculate BMI online free. Metric and imperial units.", alternates: { canonical: "https://easyconverter.io/utilities/bmi" } };

export default function BmiCalculatorPage() {
  return <ToolPageShell tool={tool}><DynamicBmiCalculator /></ToolPageShell>;
}

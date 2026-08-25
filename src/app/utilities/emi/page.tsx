import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicEmiCalculator } from "@/components/tools/utility/DynamicUtilityConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("util-emi")!;
export const metadata: Metadata = { title: "EMI Calculator – Loan EMI Calculator Free | EasyConverter.io", description: "Calculate EMI for loans online. Supports months and years tenure.", alternates: { canonical: "https://easyconverter.io/utilities/emi" } };

export default function EmiCalculatorPage() {
  return <ToolPageShell tool={tool}><DynamicEmiCalculator /></ToolPageShell>;
}

import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicGstCalculator } from "@/components/tools/utility/DynamicUtilityConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("util-gst")!;
export const metadata: Metadata = { title: "GST Calculator – Add & Remove GST Online | EasyConverter.io", description: "Calculate GST India. Add or remove GST. All slabs supported.", alternates: { canonical: "https://www.easyconverter.io/utilities/gst" } };

export default function GstCalculatorPage() {
  return <ToolPageShell tool={tool}><DynamicGstCalculator /></ToolPageShell>;
}

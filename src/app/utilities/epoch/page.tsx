import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicEpochConverter } from "@/components/tools/utility/DynamicUtilityConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("util-epoch")!;
export const metadata: Metadata = { title: "Epoch Converter – Unix Timestamp to Date | EasyConverter.io", description: "Convert Unix timestamps to dates and vice versa.", alternates: { canonical: "https://www.easyconverter.io/utilities/epoch" } };

export default function EpochConverterPage() {
  return <ToolPageShell tool={tool}><DynamicEpochConverter /></ToolPageShell>;
}

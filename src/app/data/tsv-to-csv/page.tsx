import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicTsvToCsv } from "@/components/tools/data/DynamicDataConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("data-tsv-to-csv")!;
export const metadata: Metadata = { title: "TSV to CSV Converter – Free Online | EasyConverter.io", description: "Convert TSV (tab-separated) to CSV or CSV to TSV online free.", alternates: { canonical: "https://easyconverter.io/data/tsv-to-csv" } };

export default function TsvToCsvPage() {
  return <ToolPageShell tool={tool}><DynamicTsvToCsv /></ToolPageShell>;
}

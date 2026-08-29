import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicCsvToJson } from "@/components/tools/data/DynamicDataConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("data-csv-to-json")!;
export const metadata: Metadata = { title: "CSV to JSON Converter Online Free | EasyConverter.io", description: "Convert CSV to JSON online free. No upload needed.", alternates: { canonical: "https://www.easyconverter.io/data/csv-to-json/" } };

export default function CsvToJsonPage() {
  return <ToolPageShell tool={tool}><DynamicCsvToJson /></ToolPageShell>;
}

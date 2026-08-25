import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicCsvToXml } from "@/components/tools/data/DynamicDataConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("data-csv-to-xml")!;
export const metadata: Metadata = { title: "CSV to XML Converter Online Free | EasyConverter.io", description: "Convert CSV to XML online free. No upload needed.", alternates: { canonical: "https://easyconverter.io/data/csv-to-xml" } };

export default function CsvToXmlPage() {
  return <ToolPageShell tool={tool}><DynamicCsvToXml /></ToolPageShell>;
}

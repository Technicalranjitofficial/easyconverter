import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicExcelToJson } from "@/components/tools/data/DynamicDataConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("data-excel-to-json")!;
export const metadata: Metadata = { title: "Excel to JSON Converter Online Free | EasyConverter.io", description: "Convert Excel (.xlsx) to JSON online free. No upload needed.", alternates: { canonical: "https://www.easyconverter.io/data/excel-to-json/" } };

export default function ExcelToJsonPage() {
  return <ToolPageShell tool={tool}><DynamicExcelToJson /></ToolPageShell>;
}

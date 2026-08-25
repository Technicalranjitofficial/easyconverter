import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicJsonToTable } from "@/components/tools/data/DynamicDataConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("data-json-to-table")!;
export const metadata: Metadata = { title: "JSON to HTML Table Converter Online Free | EasyConverter.io", description: "Convert JSON array to HTML table online free. No upload.", alternates: { canonical: "https://easyconverter.io/data/json-to-table" } };

export default function JsonToTablePage() {
  return <ToolPageShell tool={tool}><DynamicJsonToTable /></ToolPageShell>;
}

import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicJsonToCsv } from "@/components/tools/data/DynamicDataConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("data-json-to-csv")!;
export const metadata: Metadata = { title: "JSON to CSV Converter Online Free | EasyConverter.io", description: "Convert JSON array to CSV online free. No upload needed.", alternates: { canonical: "https://www.easyconverter.io/data/json-to-csv" } };

export default function JsonToCsvPage() {
  return <ToolPageShell tool={tool}><DynamicJsonToCsv /></ToolPageShell>;
}

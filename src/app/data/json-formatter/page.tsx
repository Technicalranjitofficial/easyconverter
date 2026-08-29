import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicJsonFormatter } from "@/components/tools/data/DynamicDataConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("data-json-formatter")!;
export const metadata: Metadata = { title: "JSON Formatter & Minifier Online Free | EasyConverter.io", description: "Format or minify JSON online free. Validate and beautify JSON.", alternates: { canonical: "https://www.easyconverter.io/data/json-formatter" } };

export default function JsonFormatterPage() {
  return <ToolPageShell tool={tool}><DynamicJsonFormatter /></ToolPageShell>;
}

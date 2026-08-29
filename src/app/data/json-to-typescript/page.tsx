import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicJsonToTypeScript } from "@/components/tools/data/DynamicDataConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("data-json-to-typescript")!;
export const metadata: Metadata = { title: "JSON to TypeScript Interface Generator Free | EasyConverter.io", description: "Generate TypeScript interfaces from JSON online free.", alternates: { canonical: "https://www.easyconverter.io/data/json-to-typescript/" } };

export default function JsonToTypeScriptPage() {
  return <ToolPageShell tool={tool}><DynamicJsonToTypeScript /></ToolPageShell>;
}

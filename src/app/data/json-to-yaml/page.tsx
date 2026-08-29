import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicJsonToYaml } from "@/components/tools/data/DynamicDataConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("data-json-to-yaml")!;
export const metadata: Metadata = { title: "JSON to YAML Converter Online Free | EasyConverter.io", description: "Convert JSON to YAML online free. No upload needed.", alternates: { canonical: "https://www.easyconverter.io/data/json-to-yaml" } };

export default function JsonToYamlPage() {
  return <ToolPageShell tool={tool}><DynamicJsonToYaml /></ToolPageShell>;
}

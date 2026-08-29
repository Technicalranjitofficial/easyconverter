import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicYamlToJson } from "@/components/tools/data/DynamicDataConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("data-yaml-to-json")!;
export const metadata: Metadata = { title: "YAML to JSON Converter Online Free | EasyConverter.io", description: "Convert YAML to JSON online free. No upload needed.", alternates: { canonical: "https://www.easyconverter.io/data/yaml-to-json" } };

export default function YamlToJsonPage() {
  return <ToolPageShell tool={tool}><DynamicYamlToJson /></ToolPageShell>;
}

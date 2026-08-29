import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicJsonValidator } from "@/components/tools/data/DynamicDataConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("data-json-validator")!;
export const metadata: Metadata = { title: "JSON Validator – Validate JSON Online Free | EasyConverter.io", description: "Validate and format JSON online free. Instant syntax checking.", alternates: { canonical: "https://www.easyconverter.io/data/json-validator/" } };

export default function JsonValidatorPage() {
  return <ToolPageShell tool={tool}><DynamicJsonValidator /></ToolPageShell>;
}

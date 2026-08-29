import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicJsonDiff } from "@/components/tools/data/DynamicDataConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("data-json-diff")!;
export const metadata: Metadata = { title: "JSON Diff Checker – Compare Two JSONs Free | EasyConverter.io", description: "Compare two JSON objects and see differences highlighted. Free online.", alternates: { canonical: "https://www.easyconverter.io/data/json-diff" } };

export default function JsonDiffPage() {
  return <ToolPageShell tool={tool}><DynamicJsonDiff /></ToolPageShell>;
}

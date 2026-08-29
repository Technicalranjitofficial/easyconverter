import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicXmlToJson } from "@/components/tools/data/DynamicDataConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("data-xml-to-json")!;
export const metadata: Metadata = { title: "XML to JSON Converter Online Free | EasyConverter.io", description: "Convert XML to JSON online free. Browser-based, no upload.", alternates: { canonical: "https://www.easyconverter.io/data/xml-to-json" } };

export default function XmlToJsonPage() {
  return <ToolPageShell tool={tool}><DynamicXmlToJson /></ToolPageShell>;
}

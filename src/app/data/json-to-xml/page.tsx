import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicJsonToXml } from "@/components/tools/data/DynamicDataConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("data-json-to-xml")!;
export const metadata: Metadata = { title: "JSON to XML Converter Online Free | EasyConverter.io", description: "Convert JSON to XML online free. Browser-based, no upload.", alternates: { canonical: "https://easyconverter.io/data/json-to-xml" } };

export default function JsonToXmlPage() {
  return <ToolPageShell tool={tool}><DynamicJsonToXml /></ToolPageShell>;
}

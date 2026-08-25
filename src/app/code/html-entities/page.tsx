import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicHtmlEntities } from "@/components/tools/code/DynamicCodeConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("code-html-entities")!;
export const metadata: Metadata = { title: "HTML Entities Encode Decode Online Free | EasyConverter.io", description: "Encode or decode HTML entities online free.", alternates: { canonical: "https://easyconverter.io/code/html-entities" } };

export default function HtmlEntitiesPage() {
  return <ToolPageShell tool={tool}><DynamicHtmlEntities /></ToolPageShell>;
}

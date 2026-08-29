import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicHtmlFormatter } from "@/components/tools/code/DynamicCodeConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("code-html-formatter")!;
export const metadata: Metadata = { title: "HTML Formatter & Minifier Online Free | EasyConverter.io", description: "Format and minify HTML online free. Beautify or compress HTML code.", alternates: { canonical: "https://www.easyconverter.io/code/html-formatter" } };

export default function HtmlFormatterPage() {
  return <ToolPageShell tool={tool}><DynamicHtmlFormatter /></ToolPageShell>;
}

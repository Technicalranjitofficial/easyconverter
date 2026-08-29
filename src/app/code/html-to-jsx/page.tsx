import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicHtmlToJsx } from "@/components/tools/code/DynamicCodeConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("code-html-to-jsx")!;
export const metadata: Metadata = { title: "HTML to JSX Converter – Free Online | EasyConverter.io", description: "Convert HTML to JSX online free. Converts class, for, style attributes.", alternates: { canonical: "https://www.easyconverter.io/code/html-to-jsx/" } };

export default function HtmlToJsxPage() {
  return <ToolPageShell tool={tool}><DynamicHtmlToJsx /></ToolPageShell>;
}

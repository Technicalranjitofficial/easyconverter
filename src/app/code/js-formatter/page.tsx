import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicJsFormatter } from "@/components/tools/code/DynamicCodeConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("code-js-formatter")!;
export const metadata: Metadata = { title: "JavaScript Formatter & Minifier Online Free | EasyConverter.io", description: "Format and minify JavaScript online free. Beautify or compress JS code.", alternates: { canonical: "https://www.easyconverter.io/code/js-formatter/" } };

export default function JsFormatterPage() {
  return <ToolPageShell tool={tool}><DynamicJsFormatter /></ToolPageShell>;
}

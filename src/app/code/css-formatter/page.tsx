import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicCssFormatter } from "@/components/tools/code/DynamicCodeConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("code-css-formatter")!;
export const metadata: Metadata = { title: "CSS Formatter & Minifier Online Free | EasyConverter.io", description: "Format and minify CSS online free. Beautify or compress CSS code.", alternates: { canonical: "https://www.easyconverter.io/code/css-formatter/" } };

export default function CssFormatterPage() {
  return <ToolPageShell tool={tool}><DynamicCssFormatter /></ToolPageShell>;
}

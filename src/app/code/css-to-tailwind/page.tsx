import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicCssToTailwind } from "@/components/tools/code/DynamicCodeConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("code-css-to-tailwind")!;
export const metadata: Metadata = { title: "CSS to Tailwind Converter Online Free | EasyConverter.io", description: "Convert CSS to Tailwind CSS classes online free.", alternates: { canonical: "https://easyconverter.io/code/css-to-tailwind" } };

export default function CssToTailwindPage() {
  return <ToolPageShell tool={tool}><DynamicCssToTailwind /></ToolPageShell>;
}

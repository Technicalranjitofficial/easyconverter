import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicCssPrefixer } from "@/components/tools/code/DynamicCodeConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("code-css-prefixer")!;
export const metadata: Metadata = { title: "CSS Autoprefixer – Add Vendor Prefixes Free | EasyConverter.io", description: "Add CSS vendor prefixes (-webkit-, -moz-, -ms-) automatically online.", alternates: { canonical: "https://www.easyconverter.io/code/css-prefixer" } };

export default function CssPrefixerPage() {
  return <ToolPageShell tool={tool}><DynamicCssPrefixer /></ToolPageShell>;
}

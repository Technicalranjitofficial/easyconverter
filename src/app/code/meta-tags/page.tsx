import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicMetaTagsGenerator } from "@/components/tools/code/DynamicCodeConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("code-meta-tags")!;
export const metadata: Metadata = { title: "Meta Tags Generator – SEO Meta Tags Free | EasyConverter.io", description: "Generate SEO meta tags, Open Graph and Twitter Card tags online free.", alternates: { canonical: "https://www.easyconverter.io/code/meta-tags" } };

export default function MetaTagsGeneratorPage() {
  return <ToolPageShell tool={tool}><DynamicMetaTagsGenerator /></ToolPageShell>;
}

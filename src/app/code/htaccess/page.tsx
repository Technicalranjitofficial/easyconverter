import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicHtaccessGenerator } from "@/components/tools/code/DynamicCodeConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("code-htaccess")!;
export const metadata: Metadata = { title: "Htaccess Generator – .htaccess Generator Free | EasyConverter.io", description: "Generate .htaccess rules: HTTPS redirect, www, caching, gzip.", alternates: { canonical: "https://www.easyconverter.io/code/htaccess" } };

export default function HtaccessGeneratorPage() {
  return <ToolPageShell tool={tool}><DynamicHtaccessGenerator /></ToolPageShell>;
}

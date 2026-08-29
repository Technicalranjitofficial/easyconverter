import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicJsObfuscator } from "@/components/tools/code/DynamicCodeConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("code-js-obfuscator")!;
export const metadata: Metadata = { title: "JavaScript Obfuscator Online Free | EasyConverter.io", description: "Obfuscate JavaScript code online free. Minify and rename variables.", alternates: { canonical: "https://www.easyconverter.io/code/js-obfuscator" } };

export default function JsObfuscatorPage() {
  return <ToolPageShell tool={tool}><DynamicJsObfuscator /></ToolPageShell>;
}

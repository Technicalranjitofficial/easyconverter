import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicHashGenerator } from "@/components/tools/utility/DynamicUtilityConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("util-hash")!;
export const metadata: Metadata = { title: "Hash Generator – SHA-256, SHA-512 Online Free | EasyConverter.io", description: "Generate SHA-1, SHA-256, SHA-512 hashes online free.", alternates: { canonical: "https://www.easyconverter.io/utilities/hash/" } };

export default function HashGeneratorPage() {
  return <ToolPageShell tool={tool}><DynamicHashGenerator /></ToolPageShell>;
}

import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicRobotsTxtGenerator } from "@/components/tools/code/DynamicCodeConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("code-robots-txt")!;
export const metadata: Metadata = { title: "Robots.txt Generator – Free Online | EasyConverter.io", description: "Generate a robots.txt file for your website online free.", alternates: { canonical: "https://easyconverter.io/code/robots-txt" } };

export default function RobotsTxtGeneratorPage() {
  return <ToolPageShell tool={tool}><DynamicRobotsTxtGenerator /></ToolPageShell>;
}

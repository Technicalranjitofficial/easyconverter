import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicRegexTester } from "@/components/tools/utility/DynamicUtilityConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("util-regex")!;
export const metadata: Metadata = { title: "Regex Tester – Test Regular Expressions Online | EasyConverter.io", description: "Test regular expressions with real-time highlighting.", alternates: { canonical: "https://www.easyconverter.io/utilities/regex/" } };

export default function RegexTesterPage() {
  return <ToolPageShell tool={tool}><DynamicRegexTester /></ToolPageShell>;
}

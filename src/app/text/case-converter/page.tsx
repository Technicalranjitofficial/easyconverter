import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicCaseConverter } from "@/components/tools/text/DynamicTextConverter";
import { getToolById } from "@/config/tools";

// Tool must exist in tools.ts — added separately
const tool = getToolById("case-converter")!;
export const metadata: Metadata = {
  title: "Case Converter – Convert Text to Upper, Lower, Title Case Free | EasyConverter.io",
  description: "Convert text to UPPER CASE, lower case, Title Case, camelCase, snake_case and more. Free online text case converter.",
  alternates: { canonical: "https://easyconverter.io/text/case-converter" },
  openGraph: { title: "Case Converter – Convert Text to Upper, Lower, Title Case Free", description: "Convert text to UPPER CASE, lower case, Title Case, camelCase, snake_case and more. Free online text case converter.", url: "https://easyconverter.io/text/case-converter", siteName: "EasyConverter.io", type: "website" },
};

export default function CaseConverter() {
  return (
    <ToolPageShell tool={tool}>
      <DynamicCaseConverter />
    </ToolPageShell>
  );
}

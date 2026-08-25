import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicSqlFormatter } from "@/components/tools/code/DynamicCodeConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("code-sql-formatter")!;
export const metadata: Metadata = { title: "SQL Formatter – Format SQL Online Free | EasyConverter.io", description: "Format and beautify SQL queries online free. No upload needed.", alternates: { canonical: "https://easyconverter.io/code/sql-formatter" } };

export default function SqlFormatterPage() {
  return <ToolPageShell tool={tool}><DynamicSqlFormatter /></ToolPageShell>;
}

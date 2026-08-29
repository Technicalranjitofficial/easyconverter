import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicDocxToTxt } from "@/components/tools/document/DynamicDocumentConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("doc-docx-to-txt")!;
export const metadata: Metadata = { title: "DOCX to TXT – Extract Text from Word Free | EasyConverter.io", description: "Extract plain text from Word (.docx) documents online free.", alternates: { canonical: "https://www.easyconverter.io/document/docx-to-txt" } };

export default function DocxToTxtPage() {
  return <ToolPageShell tool={tool}><DynamicDocxToTxt /></ToolPageShell>;
}

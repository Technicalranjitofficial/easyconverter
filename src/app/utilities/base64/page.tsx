import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicBase64Tool } from "@/components/tools/utility/DynamicUtilityConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("util-base64")!;
export const metadata: Metadata = { title: "Base64 Encode Decode – Free Online | EasyConverter.io", description: "Encode and decode Base64 strings online free.", alternates: { canonical: "https://www.easyconverter.io/utilities/base64/" } };

export default function Base64ToolPage() {
  return <ToolPageShell tool={tool}><DynamicBase64Tool /></ToolPageShell>;
}

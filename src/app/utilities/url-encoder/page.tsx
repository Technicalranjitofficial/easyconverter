import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicUrlEncoder } from "@/components/tools/utility/DynamicUtilityConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("util-url-encoder")!;
export const metadata: Metadata = { title: "URL Encoder Decoder – Free Online | EasyConverter.io", description: "URL encode and decode strings online free.", alternates: { canonical: "https://www.easyconverter.io/utilities/url-encoder" } };

export default function UrlEncoderPage() {
  return <ToolPageShell tool={tool}><DynamicUrlEncoder /></ToolPageShell>;
}

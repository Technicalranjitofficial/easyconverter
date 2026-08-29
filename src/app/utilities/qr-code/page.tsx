import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicQrCodeGenerator } from "@/components/tools/utility/DynamicUtilityConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("util-qr-code")!;
export const metadata: Metadata = { title: "QR Code Generator – Free Online | EasyConverter.io", description: "Generate QR codes for URLs and text. Download as PNG.", alternates: { canonical: "https://www.easyconverter.io/utilities/qr-code" } };

export default function QrCodeGeneratorPage() {
  return <ToolPageShell tool={tool}><DynamicQrCodeGenerator /></ToolPageShell>;
}

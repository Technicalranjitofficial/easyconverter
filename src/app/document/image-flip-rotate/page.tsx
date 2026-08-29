import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicImageFlipRotate } from "@/components/tools/document/DynamicDocumentConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("doc-image-flip-rotate")!;
export const metadata: Metadata = { title: "Image Flip & Rotate – Free Online Tool | EasyConverter.io", description: "Flip or rotate images online free. Horizontal flip, vertical flip, 90° rotation.", alternates: { canonical: "https://www.easyconverter.io/document/image-flip-rotate/" } };

export default function ImageFlipRotatePage() {
  return <ToolPageShell tool={tool}><DynamicImageFlipRotate /></ToolPageShell>;
}

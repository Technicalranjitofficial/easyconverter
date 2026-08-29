import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicColorConverter } from "@/components/tools/code/DynamicCodeConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("code-color-converter")!;
export const metadata: Metadata = { title: "Color Converter – HEX, RGB, HSL Online Free | EasyConverter.io", description: "Convert colors between HEX, RGB, RGBA and HSL formats online free.", alternates: { canonical: "https://www.easyconverter.io/code/color-converter/" } };

export default function ColorConverterPage() {
  return <ToolPageShell tool={tool}><DynamicColorConverter /></ToolPageShell>;
}

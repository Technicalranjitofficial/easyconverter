import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicUuidGenerator } from "@/components/tools/utility/DynamicUtilityConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("util-uuid")!;
export const metadata: Metadata = { title: "UUID Generator – Generate UUIDs Online Free | EasyConverter.io", description: "Generate UUID v4 identifiers online. Batch up to 50.", alternates: { canonical: "https://www.easyconverter.io/utilities/uuid" } };

export default function UuidGeneratorPage() {
  return <ToolPageShell tool={tool}><DynamicUuidGenerator /></ToolPageShell>;
}

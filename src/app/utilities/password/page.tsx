import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicPasswordGenerator } from "@/components/tools/utility/DynamicUtilityConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("util-password")!;
export const metadata: Metadata = { title: "Password Generator – Strong Passwords Free | EasyConverter.io", description: "Generate strong random passwords with custom settings.", alternates: { canonical: "https://www.easyconverter.io/utilities/password" } };

export default function PasswordGeneratorPage() {
  return <ToolPageShell tool={tool}><DynamicPasswordGenerator /></ToolPageShell>;
}

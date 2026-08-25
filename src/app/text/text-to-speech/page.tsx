import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicTextToSpeech } from "@/components/tools/text/DynamicTextConverter";
import { getToolById } from "@/config/tools";

// Tool must exist in tools.ts — added separately
const tool = getToolById("text-to-speech")!;
export const metadata: Metadata = {
  title: "Text to Speech Online Free – Convert Text to Audio | EasyConverter.io",
  description: "Convert text to speech online for free. Choose voice, speed and pitch. Uses your browser's speech engine.",
  alternates: { canonical: "https://easyconverter.io/text/text-to-speech" },
  openGraph: { title: "Text to Speech Online Free – Convert Text to Audio", description: "Convert text to speech online for free. Choose voice, speed and pitch. Uses your browser's speech engine.", url: "https://easyconverter.io/text/text-to-speech", siteName: "EasyConverter.io", type: "website" },
};

export default function TextToSpeechPage() {
  return (
    <ToolPageShell tool={tool}>
      <DynamicTextToSpeech />
    </ToolPageShell>
  );
}

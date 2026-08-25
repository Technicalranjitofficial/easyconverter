import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicWordCounter } from "@/components/tools/text/DynamicTextConverter";
import { getToolById } from "@/config/tools";

// Tool must exist in tools.ts — added separately
const tool = getToolById("word-counter")!;
export const metadata: Metadata = {
  title: "Word Counter – Count Words, Characters & Lines Online Free | EasyConverter.io",
  description: "Count words, characters, lines, sentences, paragraphs and reading time instantly. Free online word counter.",
  alternates: { canonical: "https://easyconverter.io/text/word-counter" },
  openGraph: { title: "Word Counter – Count Words, Characters & Lines Online Free", description: "Count words, characters, lines, sentences, paragraphs and reading time instantly. Free online word counter.", url: "https://easyconverter.io/text/word-counter", siteName: "EasyConverter.io", type: "website" },
};

export default function WordCounter() {
  return (
    <ToolPageShell tool={tool}>
      <DynamicWordCounter />
    </ToolPageShell>
  );
}

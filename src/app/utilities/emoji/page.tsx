import type { Metadata } from "next";
import ToolPageShell from "@/components/layout/ToolPageShell";
import { DynamicEmojiPicker } from "@/components/tools/utility/DynamicUtilityConverter";
import { getToolById } from "@/config/tools";

const tool = getToolById("util-emoji")!;
export const metadata: Metadata = { title: "Emoji Picker – Copy Emoji Online Free | EasyConverter.io", description: "Browse and copy emojis from all categories.", alternates: { canonical: "https://easyconverter.io/utilities/emoji" } };

export default function EmojiPickerPage() {
  return <ToolPageShell tool={tool}><DynamicEmojiPicker /></ToolPageShell>;
}

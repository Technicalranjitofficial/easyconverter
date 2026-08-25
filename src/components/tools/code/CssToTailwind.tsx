"use client";
import CodeEditorShell from "@/components/tools/shared/CodeEditorShell";
import { cssToTailwind } from "@/lib/converters/codeConverter";

export default function CssToTailwind() {
  return (
    <CodeEditorShell
      transform={cssToTailwind}

      inputPlaceholder={"display: flex; align-items: center;"}
      downloadFileName="output.txt"
      sideBySide
      showStats
    />
  );
}

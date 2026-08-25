"use client";
import CodeEditorShell from "@/components/tools/shared/CodeEditorShell";
import { htmlToJsx } from "@/lib/converters/codeConverter";

export default function HtmlToJsx() {
  return (
    <CodeEditorShell
      transform={htmlToJsx}

      inputPlaceholder={"<div class='box'>Hi</div>"}
      downloadFileName="output.jsx"
      sideBySide
      showStats
    />
  );
}

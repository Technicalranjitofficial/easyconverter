"use client";
import CodeEditorShell from "@/components/tools/shared/CodeEditorShell";
import { formatHtml, minifyHtml } from "@/lib/converters/codeConverter";

export default function HtmlFormatter() {
  return (
    <CodeEditorShell
      transform={formatHtml}
      modes={[{ label:"Format", fn:formatHtml }, { label:"Minify", fn:minifyHtml }]}
      inputPlaceholder={"<div>Hello</div>"}
      downloadFileName="output.html"
      sideBySide
      showStats
    />
  );
}

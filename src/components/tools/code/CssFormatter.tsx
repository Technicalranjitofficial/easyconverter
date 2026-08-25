"use client";
import CodeEditorShell from "@/components/tools/shared/CodeEditorShell";
import { formatCss, minifyCss } from "@/lib/converters/codeConverter";

export default function CssFormatter() {
  return (
    <CodeEditorShell
      transform={formatCss}
      modes={[{ label:"Format", fn:formatCss }, { label:"Minify", fn:minifyCss }]}
      inputPlaceholder={"body{color:red}"}
      downloadFileName="output.css"
      sideBySide
      showStats
    />
  );
}

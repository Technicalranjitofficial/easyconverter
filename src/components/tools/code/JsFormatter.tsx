"use client";
import CodeEditorShell from "@/components/tools/shared/CodeEditorShell";
import { formatJs, minifyJs } from "@/lib/converters/codeConverter";

export default function JsFormatter() {
  return (
    <CodeEditorShell
      transform={formatJs}
      modes={[{ label:"Format", fn:formatJs }, { label:"Minify", fn:minifyJs }]}
      inputPlaceholder={"function hello(){return 42}"}
      downloadFileName="output.js"
      sideBySide
      showStats
    />
  );
}

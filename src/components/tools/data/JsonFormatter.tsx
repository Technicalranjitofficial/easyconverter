"use client";
import CodeEditorShell from "@/components/tools/shared/CodeEditorShell";
import { formatJson, minifyJson } from "@/lib/converters/dataConverter";

export default function JsonFormatter() {
  return (
    <CodeEditorShell
      transform={formatJson}
      modes={[{ label:"Format", fn:formatJson }, { label:"Minify", fn:minifyJson }]}
      inputPlaceholder={"Enter JSON…"}
      downloadFileName="output.json"
      sideBySide
      showStats
    />
  );
}

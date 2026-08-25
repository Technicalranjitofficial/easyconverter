"use client";
import CodeEditorShell from "@/components/tools/shared/CodeEditorShell";
import { jsonToTypeScript } from "@/lib/converters/dataConverter";

export default function JsonToTypeScript() {
  return (
    <CodeEditorShell
      transform={jsonToTypeScript}

      inputPlaceholder={"Enter JSON…"}
      downloadFileName="output.ts"
      sideBySide
      showStats
    />
  );
}

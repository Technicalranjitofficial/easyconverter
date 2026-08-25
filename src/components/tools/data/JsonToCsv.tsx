"use client";
import CodeEditorShell from "@/components/tools/shared/CodeEditorShell";
import { jsonToCsv } from "@/lib/converters/dataConverter";

export default function JsonToCsv() {
  return (
    <CodeEditorShell
      transform={jsonToCsv}

      inputPlaceholder={"Enter JSON array…"}
      downloadFileName="output.csv"
      sideBySide
      showStats
    />
  );
}

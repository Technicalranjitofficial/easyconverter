"use client";
import CodeEditorShell from "@/components/tools/shared/CodeEditorShell";
import { xmlToJson } from "@/lib/converters/dataConverter";

export default function XmlToJson() {
  return (
    <CodeEditorShell
      transform={xmlToJson}

      inputPlaceholder={"<root><item>1</item></root>"}
      downloadFileName="output.json"
      sideBySide
      showStats
    />
  );
}

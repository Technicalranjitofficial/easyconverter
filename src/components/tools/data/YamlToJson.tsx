"use client";
import CodeEditorShell from "@/components/tools/shared/CodeEditorShell";
import { yamlToJson } from "@/lib/converters/dataConverter";

export default function YamlToJson() {
  return (
    <CodeEditorShell
      transform={yamlToJson}

      inputPlaceholder={"key: value"}
      downloadFileName="output.json"
      sideBySide
      showStats
    />
  );
}

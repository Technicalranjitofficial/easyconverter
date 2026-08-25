"use client";
import CodeEditorShell from "@/components/tools/shared/CodeEditorShell";
import { csvToJson } from "@/lib/converters/dataConverter";

export default function CsvToJson() {
  return (
    <CodeEditorShell
      transform={csvToJson}

      inputPlaceholder={"name,age,city"}
      downloadFileName="output.json"
      sideBySide
      showStats
    />
  );
}

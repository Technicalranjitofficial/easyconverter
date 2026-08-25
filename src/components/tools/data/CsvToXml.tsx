"use client";
import CodeEditorShell from "@/components/tools/shared/CodeEditorShell";
import { csvToXml } from "@/lib/converters/dataConverter";

export default function CsvToXml() {
  return (
    <CodeEditorShell
      transform={csvToXml}

      inputPlaceholder={"name,age\nAlice,30"}
      downloadFileName="output.xml"
      sideBySide
      showStats
    />
  );
}

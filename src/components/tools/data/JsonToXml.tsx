"use client";
import CodeEditorShell from "@/components/tools/shared/CodeEditorShell";
import { jsonToXml } from "@/lib/converters/dataConverter";

export default function JsonToXml() {
  return (
    <CodeEditorShell
      transform={jsonToXml}

      inputPlaceholder={"Enter JSON…"}
      downloadFileName="output.xml"
      sideBySide
      showStats
    />
  );
}

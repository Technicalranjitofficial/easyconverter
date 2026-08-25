"use client";
import CodeEditorShell from "@/components/tools/shared/CodeEditorShell";
import { jsonToYaml } from "@/lib/converters/dataConverter";

export default function JsonToYaml() {
  return (
    <CodeEditorShell
      transform={jsonToYaml}

      inputPlaceholder={"Enter JSON…"}
      downloadFileName="output.yaml"
      sideBySide
      showStats
    />
  );
}

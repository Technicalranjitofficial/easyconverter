"use client";
import CodeEditorShell from "@/components/tools/shared/CodeEditorShell";
import { obfuscateJs } from "@/lib/converters/codeConverter";

export default function JsObfuscator() {
  return (
    <CodeEditorShell
      transform={obfuscateJs}

      inputPlaceholder={"function greet(name){return name}"}
      downloadFileName="output.js"
      sideBySide
      showStats
    />
  );
}

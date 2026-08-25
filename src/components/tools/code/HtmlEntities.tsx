"use client";
import CodeEditorShell from "@/components/tools/shared/CodeEditorShell";
import { encodeHtmlEntities, decodeHtmlEntities } from "@/lib/converters/codeConverter";

export default function HtmlEntities() {
  return (
    <CodeEditorShell
      transform={encodeHtmlEntities}
      modes={[{ label:"Encode", fn:encodeHtmlEntities }, { label:"Decode", fn:decodeHtmlEntities }]}
      inputPlaceholder={"<div>Test</div>"}
      downloadFileName="output.txt"
      sideBySide
      showStats
    />
  );
}

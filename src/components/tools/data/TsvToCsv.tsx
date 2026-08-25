"use client";
import CodeEditorShell from "@/components/tools/shared/CodeEditorShell";
import { tsvToCsv, csvToTsv } from "@/lib/converters/dataConverter";

export default function TsvToCsv() {
  return (
    <CodeEditorShell
      transform={tsvToCsv}
      modes={[{ label:"TSV → CSV", fn:tsvToCsv }, { label:"CSV → TSV", fn:csvToTsv }]}
      inputPlaceholder={"col1\tcol2\tcol3"}
      downloadFileName="output.csv"
      sideBySide
      showStats
    />
  );
}

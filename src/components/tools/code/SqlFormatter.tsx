"use client";
import CodeEditorShell from "@/components/tools/shared/CodeEditorShell";
import { formatSql } from "@/lib/converters/codeConverter";

export default function SqlFormatter() {
  return (
    <CodeEditorShell
      transform={formatSql}

      inputPlaceholder={"select * from users where id=1"}
      downloadFileName="output.sql"
      sideBySide
      showStats
    />
  );
}

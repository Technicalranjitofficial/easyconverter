"use client";
import TextToolShell from "@/components/tools/shared/TextToolShell";
import {
  toUpperCase, toLowerCase, toTitleCase, toSentenceCase,
  toCamelCase, toPascalCase, toSnakeCase, toKebabCase,
  toAlternatingCase, toInverseCase,
} from "@/lib/converters/textConverter";

const modes = [
  { label: "UPPER CASE",       fn: toUpperCase   },
  { label: "lower case",       fn: toLowerCase   },
  { label: "Title Case",       fn: toTitleCase   },
  { label: "Sentence case",    fn: toSentenceCase },
  { label: "camelCase",        fn: toCamelCase   },
  { label: "PascalCase",       fn: toPascalCase  },
  { label: "snake_case",       fn: toSnakeCase   },
  { label: "kebab-case",       fn: toKebabCase   },
  { label: "aLtErNaTiNg",      fn: toAlternatingCase },
  { label: "iNVERSE cASE",     fn: toInverseCase },
];

export default function CaseConverter() {
  return (
    <TextToolShell
      modes={modes}
      transform={toUpperCase}
      placeholder="Type or paste text to convert…"
      inputLabel="Input Text"
      outputLabel="Converted Text"
      downloadFileName="converted.txt"
    />
  );
}

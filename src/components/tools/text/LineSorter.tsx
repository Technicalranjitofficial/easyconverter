"use client";
import TextToolShell from "@/components/tools/shared/TextToolShell";
import { sortLinesAZ, sortLinesZA, reverseLinesOrder, sortLinesByLength, shuffleLines } from "@/lib/converters/textConverter";

export default function LineSorter() {
  return (
    <TextToolShell
      modes={[
        { label: "A → Z",      fn: sortLinesAZ },
        { label: "Z → A",      fn: sortLinesZA },
        { label: "By Length",  fn: sortLinesByLength },
        { label: "Reverse",    fn: reverseLinesOrder },
        { label: "Shuffle",    fn: shuffleLines },
      ]}
      transform={sortLinesAZ}
      placeholder="One line per item…"
      inputLabel="Lines to Sort"
      outputLabel="Sorted Lines"
      showStats
    />
  );
}

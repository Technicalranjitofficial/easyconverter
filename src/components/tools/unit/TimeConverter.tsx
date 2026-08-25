"use client";
import UnitConverterShell from "@/components/tools/shared/UnitConverterShell";
import { TIME_UNITS } from "@/lib/converters/unitConverter";

export default function TimeConverter() {
  return <UnitConverterShell units={TIME_UNITS} defaultFrom={1} defaultFromUnit={4} defaultToUnit={3} />;
}

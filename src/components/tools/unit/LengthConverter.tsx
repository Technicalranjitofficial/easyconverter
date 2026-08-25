"use client";
import UnitConverterShell from "@/components/tools/shared/UnitConverterShell";
import { LENGTH_UNITS } from "@/lib/converters/unitConverter";

export default function LengthConverter() {
  return <UnitConverterShell units={LENGTH_UNITS} defaultFrom={1} defaultFromUnit={0} defaultToUnit={1} />;
}

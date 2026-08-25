"use client";
import UnitConverterShell from "@/components/tools/shared/UnitConverterShell";
import { RESOLUTION_UNITS } from "@/lib/converters/unitConverter";

export default function ResolutionConverter() {
  return <UnitConverterShell units={RESOLUTION_UNITS} defaultFrom={1} defaultFromUnit={0} defaultToUnit={2} />;
}

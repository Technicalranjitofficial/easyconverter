"use client";
import UnitConverterShell from "@/components/tools/shared/UnitConverterShell";
import { POWER_UNITS } from "@/lib/converters/unitConverter";

export default function PowerConverter() {
  return <UnitConverterShell units={POWER_UNITS} defaultFrom={1} defaultFromUnit={0} defaultToUnit={3} />;
}

"use client";
import UnitConverterShell from "@/components/tools/shared/UnitConverterShell";
import { SPEED_UNITS } from "@/lib/converters/unitConverter";

export default function SpeedConverter() {
  return <UnitConverterShell units={SPEED_UNITS} defaultFrom={1} defaultFromUnit={0} defaultToUnit={1} />;
}

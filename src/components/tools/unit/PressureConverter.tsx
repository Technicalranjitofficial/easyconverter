"use client";
import UnitConverterShell from "@/components/tools/shared/UnitConverterShell";
import { PRESSURE_UNITS } from "@/lib/converters/unitConverter";

export default function PressureConverter() {
  return <UnitConverterShell units={PRESSURE_UNITS} defaultFrom={1} defaultFromUnit={6} defaultToUnit={5} />;
}

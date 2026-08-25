"use client";
import UnitConverterShell from "@/components/tools/shared/UnitConverterShell";
import { WEIGHT_UNITS } from "@/lib/converters/unitConverter";

export default function WeightConverter() {
  return <UnitConverterShell units={WEIGHT_UNITS} defaultFrom={1} defaultFromUnit={0} defaultToUnit={4} />;
}

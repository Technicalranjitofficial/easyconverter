"use client";
import UnitConverterShell from "@/components/tools/shared/UnitConverterShell";
import { FUEL_UNITS } from "@/lib/converters/unitConverter";

export default function FuelConverter() {
  return <UnitConverterShell units={FUEL_UNITS} defaultFrom={1} defaultFromUnit={0} defaultToUnit={2} />;
}

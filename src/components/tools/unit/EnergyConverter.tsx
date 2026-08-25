"use client";
import UnitConverterShell from "@/components/tools/shared/UnitConverterShell";
import { ENERGY_UNITS } from "@/lib/converters/unitConverter";

export default function EnergyConverter() {
  return <UnitConverterShell units={ENERGY_UNITS} defaultFrom={1} defaultFromUnit={0} defaultToUnit={4} />;
}

"use client";
import UnitConverterShell from "@/components/tools/shared/UnitConverterShell";
import { TEMPERATURE_UNITS } from "@/lib/converters/unitConverter";

export default function TemperatureConverter() {
  return <UnitConverterShell units={TEMPERATURE_UNITS} defaultFrom={1} defaultFromUnit={0} defaultToUnit={1} />;
}

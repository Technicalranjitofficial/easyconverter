"use client";
import UnitConverterShell from "@/components/tools/shared/UnitConverterShell";
import { FREQUENCY_UNITS } from "@/lib/converters/unitConverter";

export default function FrequencyConverter() {
  return <UnitConverterShell units={FREQUENCY_UNITS} defaultFrom={1} defaultFromUnit={0} defaultToUnit={2} />;
}

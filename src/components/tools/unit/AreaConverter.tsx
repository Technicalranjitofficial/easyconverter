"use client";
import UnitConverterShell from "@/components/tools/shared/UnitConverterShell";
import { AREA_UNITS } from "@/lib/converters/unitConverter";

export default function AreaConverter() {
  return <UnitConverterShell units={AREA_UNITS} defaultFrom={1} defaultFromUnit={0} defaultToUnit={6} />;
}

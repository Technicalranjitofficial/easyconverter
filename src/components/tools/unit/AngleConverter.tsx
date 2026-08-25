"use client";
import UnitConverterShell from "@/components/tools/shared/UnitConverterShell";
import { ANGLE_UNITS } from "@/lib/converters/unitConverter";

export default function AngleConverter() {
  return <UnitConverterShell units={ANGLE_UNITS} defaultFrom={1} defaultFromUnit={0} defaultToUnit={1} />;
}

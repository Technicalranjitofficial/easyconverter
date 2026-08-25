"use client";
import UnitConverterShell from "@/components/tools/shared/UnitConverterShell";
import { VOLUME_UNITS } from "@/lib/converters/unitConverter";

export default function VolumeConverter() {
  return <UnitConverterShell units={VOLUME_UNITS} defaultFrom={1} defaultFromUnit={0} defaultToUnit={3} />;
}

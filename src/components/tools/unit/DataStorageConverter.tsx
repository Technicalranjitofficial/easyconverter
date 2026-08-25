"use client";
import UnitConverterShell from "@/components/tools/shared/UnitConverterShell";
import { DATA_UNITS } from "@/lib/converters/unitConverter";

export default function DataStorageConverter() {
  return <UnitConverterShell units={DATA_UNITS} defaultFrom={1} defaultFromUnit={2} defaultToUnit={3} />;
}

"use client";
import dynamic from "next/dynamic";

const S = () => <div className="w-full min-h-[200px] rounded-[var(--radius-tool)] shimmer" />;

export const DynamicLengthConverter = dynamic(() => import("./LengthConverter"), { ssr: false, loading: S });
export const DynamicWeightConverter = dynamic(() => import("./WeightConverter"), { ssr: false, loading: S });
export const DynamicTemperatureConverter = dynamic(() => import("./TemperatureConverter"), { ssr: false, loading: S });
export const DynamicSpeedConverter = dynamic(() => import("./SpeedConverter"), { ssr: false, loading: S });
export const DynamicDataStorageConverter = dynamic(() => import("./DataStorageConverter"), { ssr: false, loading: S });
export const DynamicAreaConverter = dynamic(() => import("./AreaConverter"), { ssr: false, loading: S });
export const DynamicVolumeConverter = dynamic(() => import("./VolumeConverter"), { ssr: false, loading: S });
export const DynamicTimeConverter = dynamic(() => import("./TimeConverter"), { ssr: false, loading: S });
export const DynamicFuelConverter = dynamic(() => import("./FuelConverter"), { ssr: false, loading: S });
export const DynamicPressureConverter = dynamic(() => import("./PressureConverter"), { ssr: false, loading: S });
export const DynamicEnergyConverter = dynamic(() => import("./EnergyConverter"), { ssr: false, loading: S });
export const DynamicPowerConverter = dynamic(() => import("./PowerConverter"), { ssr: false, loading: S });
export const DynamicFrequencyConverter = dynamic(() => import("./FrequencyConverter"), { ssr: false, loading: S });
export const DynamicAngleConverter = dynamic(() => import("./AngleConverter"), { ssr: false, loading: S });
export const DynamicResolutionConverter = dynamic(() => import("./ResolutionConverter"), { ssr: false, loading: S });

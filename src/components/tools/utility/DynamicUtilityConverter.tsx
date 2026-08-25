"use client";
import dynamic from "next/dynamic";

const S = () => <div className="w-full min-h-[200px] rounded-[var(--radius-tool)] shimmer" />;

export const DynamicQrCodeGenerator = dynamic(() => import("./QrCodeGenerator"), { ssr: false, loading: S });
export const DynamicPasswordGenerator = dynamic(() => import("./PasswordGenerator"), { ssr: false, loading: S });
export const DynamicUuidGenerator = dynamic(() => import("./UuidGenerator"), { ssr: false, loading: S });
export const DynamicBase64Tool = dynamic(() => import("./Base64Tool"), { ssr: false, loading: S });
export const DynamicUrlEncoder = dynamic(() => import("./UrlEncoder"), { ssr: false, loading: S });
export const DynamicHashGenerator = dynamic(() => import("./HashGenerator"), { ssr: false, loading: S });
export const DynamicRegexTester = dynamic(() => import("./RegexTester"), { ssr: false, loading: S });
export const DynamicEpochConverter = dynamic(() => import("./EpochConverter"), { ssr: false, loading: S });
export const DynamicEmojiPicker = dynamic(() => import("./EmojiPicker"), { ssr: false, loading: S });
export const DynamicAgeCalculator = dynamic(() => import("./AgeCalculator"), { ssr: false, loading: S });
export const DynamicEmiCalculator = dynamic(() => import("./EmiCalculator"), { ssr: false, loading: S });
export const DynamicBmiCalculator = dynamic(() => import("./BmiCalculator"), { ssr: false, loading: S });
export const DynamicPercentageCalculator = dynamic(() => import("./PercentageCalculator"), { ssr: false, loading: S });
export const DynamicGstCalculator = dynamic(() => import("./GstCalculator"), { ssr: false, loading: S });

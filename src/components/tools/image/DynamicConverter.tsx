"use client";

import dynamic from "next/dynamic";

function ConverterSkeleton() {
  return (
    <div
      className="w-full min-h-[260px] rounded-[var(--radius-tool)] shimmer"
      aria-label="Loading converter…"
    />
  );
}

export const DynamicImageConverterCore = dynamic(
  () => import("./ImageConverterCore"),
  { ssr: false, loading: ConverterSkeleton }
);

export const DynamicImageCompressor = dynamic(
  () => import("./ImageCompressor"),
  { ssr: false, loading: ConverterSkeleton }
);

export const DynamicImageResizer = dynamic(
  () => import("./ImageResizer"),
  { ssr: false, loading: ConverterSkeleton }
);

export const DynamicImageCropper = dynamic(
  () => import("./ImageCropper"),
  { ssr: false, loading: ConverterSkeleton }
);

export const DynamicImageSvgConverter = dynamic(
  () => import("./ImageSvgConverter"),
  { ssr: false, loading: ConverterSkeleton }
);

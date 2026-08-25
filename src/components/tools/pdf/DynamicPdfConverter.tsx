"use client";

import dynamic from "next/dynamic";

function PdfSkeleton() {
  return (
    <div className="w-full min-h-[260px] rounded-[var(--radius-tool)] shimmer" aria-label="Loading PDF tool…" />
  );
}

export const DynamicPdfMerge = dynamic(() => import("./PdfMerge"), { ssr: false, loading: PdfSkeleton });
export const DynamicPdfSplit = dynamic(() => import("./PdfSplit"), { ssr: false, loading: PdfSkeleton });
export const DynamicPdfCompressor = dynamic(() => import("./PdfCompressor"), { ssr: false, loading: PdfSkeleton });
export const DynamicPdfRotate = dynamic(() => import("./PdfRotate"), { ssr: false, loading: PdfSkeleton });
export const DynamicPdfWatermark = dynamic(() => import("./PdfWatermark"), { ssr: false, loading: PdfSkeleton });
export const DynamicPdfPageNumbers = dynamic(() => import("./PdfPageNumbers"), { ssr: false, loading: PdfSkeleton });

// PDF to image tools re-use one shared component with format prop
import PdfToImages from "./PdfToImages";
import type { ComponentProps } from "react";

export const DynamicPdfToJpg = dynamic<ComponentProps<typeof PdfToImages>>(
  () => import("./PdfToImages"),
  { ssr: false, loading: PdfSkeleton }
);

export const DynamicPdfToPng = dynamic<ComponentProps<typeof PdfToImages>>(
  () => import("./PdfToImages"),
  { ssr: false, loading: PdfSkeleton }
);

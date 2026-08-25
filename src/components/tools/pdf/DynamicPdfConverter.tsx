"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import PdfToImages from "./PdfToImages";

function PdfSkeleton() {
  return (
    <div className="w-full min-h-[260px] rounded-[var(--radius-tool)] shimmer" aria-label="Loading PDF tool…" />
  );
}

export const DynamicPdfMerge         = dynamic(() => import("./PdfMerge"),         { ssr: false, loading: PdfSkeleton });
export const DynamicPdfSplit         = dynamic(() => import("./PdfSplit"),         { ssr: false, loading: PdfSkeleton });
export const DynamicPdfCompressor    = dynamic(() => import("./PdfCompressor"),    { ssr: false, loading: PdfSkeleton });
export const DynamicPdfRotate        = dynamic(() => import("./PdfRotate"),        { ssr: false, loading: PdfSkeleton });
export const DynamicPdfWatermark     = dynamic(() => import("./PdfWatermark"),     { ssr: false, loading: PdfSkeleton });
export const DynamicPdfPageNumbers   = dynamic(() => import("./PdfPageNumbers"),   { ssr: false, loading: PdfSkeleton });
export const DynamicPdfReorder       = dynamic(() => import("./PdfReorder"),       { ssr: false, loading: PdfSkeleton });
export const DynamicPdfImageToPdf    = dynamic(() => import("./PdfImageToPdf"),    { ssr: false, loading: PdfSkeleton });
export const DynamicPdfToText        = dynamic(() => import("./PdfToText"),        { ssr: false, loading: PdfSkeleton });
export const DynamicPdfMetadata      = dynamic(() => import("./PdfMetadata"),      { ssr: false, loading: PdfSkeleton });
export const DynamicPdfExtractImages = dynamic(() => import("./PdfExtractImages"), { ssr: false, loading: PdfSkeleton });
export const DynamicDocxToPdf        = dynamic(() => import("./DocxToPdf"),        { ssr: false, loading: PdfSkeleton });

export const DynamicPdfToJpg = dynamic<ComponentProps<typeof PdfToImages>>(
  () => import("./PdfToImages"), { ssr: false, loading: PdfSkeleton }
);
export const DynamicPdfToPng = dynamic<ComponentProps<typeof PdfToImages>>(
  () => import("./PdfToImages"), { ssr: false, loading: PdfSkeleton }
);

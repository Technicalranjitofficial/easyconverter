"use client";
import dynamic from "next/dynamic";

const S = () => <div className="w-full min-h-[200px] rounded-[var(--radius-tool)] shimmer" />;

export const DynamicHtmlToPdf = dynamic(() => import("./HtmlToPdf"), { ssr: false, loading: S });
export const DynamicTextToPdf = dynamic(() => import("./TextToPdf"), { ssr: false, loading: S });
export const DynamicHtmlMarkdownConverter = dynamic(() => import("./HtmlMarkdownConverter"), { ssr: false, loading: S });
export const DynamicPdfPageCounter = dynamic(() => import("./PdfPageCounter"), { ssr: false, loading: S });
export const DynamicDocxToTxt = dynamic(() => import("./DocxToTxt"), { ssr: false, loading: S });
export const DynamicImageFlipRotate = dynamic(() => import("./ImageFlipRotate"), { ssr: false, loading: S });

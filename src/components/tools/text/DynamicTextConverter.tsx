"use client";
import dynamic from "next/dynamic";

const S = () => <div className="w-full min-h-[260px] rounded-[var(--radius-tool)] shimmer" />;

export const DynamicWordCounter      = dynamic(() => import("./WordCounter"),      { ssr: false, loading: S });
export const DynamicCaseConverter    = dynamic(() => import("./CaseConverter"),    { ssr: false, loading: S });
export const DynamicLoremIpsum       = dynamic(() => import("./LoremIpsum"),       { ssr: false, loading: S });
export const DynamicFindReplace      = dynamic(() => import("./FindReplace"),      { ssr: false, loading: S });
export const DynamicLineSorter       = dynamic(() => import("./LineSorter"),       { ssr: false, loading: S });
export const DynamicDeduplicateLines = dynamic(() => import("./DeduplicateLines"), { ssr: false, loading: S });
export const DynamicTextRepeater     = dynamic(() => import("./TextRepeater"),     { ssr: false, loading: S });
export const DynamicDiffChecker      = dynamic(() => import("./DiffChecker"),      { ssr: false, loading: S });
export const DynamicReadabilityScore = dynamic(() => import("./ReadabilityScore"), { ssr: false, loading: S });
export const DynamicMarkdownPreview  = dynamic(() => import("./MarkdownPreview"),  { ssr: false, loading: S });
export const DynamicTextToSpeech     = dynamic(() => import("./TextToSpeech"),     { ssr: false, loading: S });
export const DynamicRandomText       = dynamic(() => import("./RandomText"),       { ssr: false, loading: S });
export const DynamicPlagiarismChecker = dynamic(() => import("./PlagiarismChecker"), { ssr: false, loading: S });

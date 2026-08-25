"use client";
import dynamic from "next/dynamic";

const S = () => <div className="w-full min-h-[200px] rounded-[var(--radius-tool)] shimmer" />;

export const DynamicHtmlFormatter = dynamic(() => import("./HtmlFormatter"), { ssr: false, loading: S });
export const DynamicCssFormatter = dynamic(() => import("./CssFormatter"), { ssr: false, loading: S });
export const DynamicJsFormatter = dynamic(() => import("./JsFormatter"), { ssr: false, loading: S });
export const DynamicHtmlToJsx = dynamic(() => import("./HtmlToJsx"), { ssr: false, loading: S });
export const DynamicHtmlEntities = dynamic(() => import("./HtmlEntities"), { ssr: false, loading: S });
export const DynamicJsObfuscator = dynamic(() => import("./JsObfuscator"), { ssr: false, loading: S });
export const DynamicSqlFormatter = dynamic(() => import("./SqlFormatter"), { ssr: false, loading: S });
export const DynamicCssToTailwind = dynamic(() => import("./CssToTailwind"), { ssr: false, loading: S });
export const DynamicCssPrefixer = dynamic(() => import("./CssPrefixer"), { ssr: false, loading: S });
export const DynamicColorConverter = dynamic(() => import("./ColorConverter"), { ssr: false, loading: S });
export const DynamicMetaTagsGenerator = dynamic(() => import("./MetaTagsGenerator"), { ssr: false, loading: S });
export const DynamicRobotsTxtGenerator = dynamic(() => import("./RobotsTxtGenerator"), { ssr: false, loading: S });
export const DynamicHtaccessGenerator = dynamic(() => import("./HtaccessGenerator"), { ssr: false, loading: S });

import { toolJsonLd } from "@/lib/seo";
import type { ToolConfig } from "@/config/tools";

interface ToolSchemasProps {
  tool: ToolConfig;
}

/**
 * Injects all structured data (JSON-LD) for a tool page:
 *  - SoftwareApplication (shows star ratings + "Free" badge in SERP)
 *  - HowTo              (shows steps directly in search results)
 *  - FAQPage            (shows expandable Q&A in SERP)
 *  - BreadcrumbList     (shows breadcrumb path under URL)
 *
 * Uses toolJsonLd() from lib/seo.ts for single source of truth.
 */
export default function ToolSchemas({ tool }: ToolSchemasProps) {
  const schemas = toolJsonLd(tool);
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
    />
  );
}

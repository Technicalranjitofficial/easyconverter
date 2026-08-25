import type { MetadataRoute } from "next";
import { allTools } from "@/config/tools";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://easyconverter.io";
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl,                    lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${baseUrl}/image`,         lastModified: now, changeFrequency: "weekly",  priority: 0.95 },
    { url: `${baseUrl}/about`,         lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/contact`,       lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/privacy`,       lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${baseUrl}/terms`,         lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${baseUrl}/cookies`,       lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
  ];

  const toolPages: MetadataRoute.Sitemap = allTools
    .filter((t) => !t.comingSoon)
    .map((tool) => ({
      url: `${baseUrl}${tool.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      // Tier priorities based on real search volumes
      priority:
        tool.searchVolume >= 700000 ? 0.95 :
        tool.searchVolume >= 400000 ? 0.9  :
        tool.searchVolume >= 200000 ? 0.85 :
        tool.searchVolume >= 100000 ? 0.8  : 0.75,
    }));

  return [...staticPages, ...toolPages];
}

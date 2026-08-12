import type { MetadataRoute } from "next";
import { getPublicSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getPublicSiteUrl();
  if (!siteUrl) return [];

  return [{ url: siteUrl.toString(), changeFrequency: "monthly", priority: 1 }];
}

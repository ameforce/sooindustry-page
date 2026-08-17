import type { MetadataRoute } from "next";
import { getPublicSiteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getPublicSiteUrl();
  return [
    { url: siteUrl.toString(), changeFrequency: "monthly", priority: 1 },
    {
      url: new URL("/company-profile/", siteUrl).toString(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}

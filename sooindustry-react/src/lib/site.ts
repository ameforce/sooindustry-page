const PUBLIC_SITE_ORIGIN = "https://sooindustrykorea.com";

export function getPublicSiteUrl(): URL {
  return new URL(PUBLIC_SITE_ORIGIN);
}

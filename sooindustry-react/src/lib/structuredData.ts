import { companyContact } from "../data/companyContact.ts";
import { getPublicSiteUrl } from "./site.ts";

export function getSiteStructuredData() {
  const siteUrl = getPublicSiteUrl();
  const organizationId = new URL("/#organization", siteUrl).toString();

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": new URL("/#website", siteUrl).toString(),
        url: siteUrl.toString(),
        name: "수인산업",
        alternateName: "SOOIN INDUSTRY",
        inLanguage: "ko-KR",
        publisher: { "@id": organizationId },
      },
      {
        "@type": ["Organization", "LocalBusiness"],
        "@id": organizationId,
        name: "수인산업",
        alternateName: "SOOIN INDUSTRY",
        legalName: "수인산업",
        description: "인천광역시 서구에서 열처리 산업로를 설계·제작·설치하는 산업 설비 전문업체",
        url: siteUrl.toString(),
        logo: new URL("/img/sooin-logo.gif", siteUrl).toString(),
        image: new URL("/img/general/misc-3.png", siteUrl).toString(),
        telephone: companyContact.phoneHref.replace("tel:", ""),
        faxNumber: companyContact.faxDisplay,
        address: {
          "@type": "PostalAddress",
          streetAddress: "마중로 142, 나동 5호 (오류동)",
          addressLocality: "서구",
          addressRegion: "인천광역시",
          addressCountry: "KR",
        },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          telephone: companyContact.phoneHref.replace("tel:", ""),
          availableLanguage: "Korean",
        },
        hasMap: [companyContact.naverMapHref, companyContact.kakaoMapHref],
      },
    ],
  } as const;
}

import type { Metadata, Viewport } from "next";
import { getPublicSiteUrl } from "@/lib/site";
import { Footer } from "./_components/footer";
import { Navbar } from "./_components/navbar";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "./globals.scss";

const siteUrl = getPublicSiteUrl();
const title = "수인산업 | 열처리 산업로";
const description = "열처리 산업로의 합리화와 효율화. 수인산업의 주요 설비와 실제 제작 이미지를 확인하세요.";

export const metadata: Metadata = {
  title,
  description,
  applicationName: "SOOIN INDUSTRY",
  keywords: ["수인산업", "열처리 산업로", "진공열처리로", "가스연질화로", "전기로", "침탄열처리로"],
  metadataBase: siteUrl,
  alternates: { canonical: "/" },
  icons: {
    icon: [{ url: "/img/sooin-logo.gif", type: "image/gif" }],
    shortcut: ["/img/sooin-logo.gif"],
  },
  openGraph: {
    title,
    description,
    type: "website",
    url: "/",
    locale: "ko_KR",
    images: [{ url: "/img/general/misc-3.png", alt: "수인산업 실제 설비" }],
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#0b1b33",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        <a className="skip-link" href="#main-content">
          본문으로 건너뛰기
        </a>
        <div className="app-shell">
          <Navbar />
          <main id="main-content">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

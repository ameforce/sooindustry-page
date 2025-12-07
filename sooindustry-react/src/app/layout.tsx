import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "./_components/navbar";
import { Footer } from "./_components/footer";
import "./globals.scss";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SOOIN Industry | Heat Treatment Solutions",
  description:
    "수인산업의 진공열처리로, 침탄로, 오링, 카본 소재 등 핵심 제품과 고객 지원 정보를 Next.js 기반으로 제공합니다.",
  metadataBase: new URL("https://www.sooindustry.com"),
  openGraph: {
    title: "SOOIN Industry",
    description:
      "열처리 산업로 제작과 엔지니어링 서비스를 제공하는 수인산업의 공식 웹사이트입니다.",
    type: "website",
    url: "https://www.sooindustry.com",
    images: [
      {
        url: "/img/main_02.jpg",
        width: 1200,
        height: 630,
        alt: "SOOIN Industry",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="stylesheet" href="/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/css/demo.css" />
        <link rel="stylesheet" href="/css/nucleo-icons.css" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-dark`}
      >
        <div className="app-shell d-flex flex-column min-vh-100 bg-white">
          <Navbar />
          <main className="flex-fill">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

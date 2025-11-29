"use client";

import { usePathname } from "next/navigation";

const hiddenFooterRoutes = new Set(["/", "/home"]);

export function Footer() {
  const pathname = usePathname();

  if (pathname && hiddenFooterRoutes.has(pathname)) {
    return null;
  }

  return (
    <footer className="footer py-5">
      <div className="container text-center text-muted">
        <small>
          © {new Date().getFullYear()} SOOIN Industry · 진공열처리 &amp; 산업로 솔루션
        </small>
      </div>
    </footer>
  );
}

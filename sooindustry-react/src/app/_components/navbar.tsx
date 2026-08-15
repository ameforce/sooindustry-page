"use client";

import Image from "next/image";
import Link from "next/link";
import { type MouseEvent as ReactMouseEvent, useEffect, useRef, useState } from "react";
import styles from "./navbar.module.scss";

const navItems = [
  { href: "/#company", label: "회사 소개" },
  { href: "/#capabilities", label: "주요 사업" },
  { href: "/#equipment", label: "실제 설비" },
  { href: "/#contact", label: "문의" },
] as const;

const TOP_SCROLL_DURATION = 720;

function easeOutQuart(progress: number) {
  return 1 - (1 - progress) ** 4;
}

export function Navbar() {
  const [expanded, setExpanded] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const topScrollFrameRef = useRef<number | null>(null);

  const handleBrandClick = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    setExpanded(false);
    const pathname = window.location.pathname.replace(/\/+$/, "") || "/";
    if (pathname !== "/") return;

    event.preventDefault();
    event.stopPropagation();
    if (window.location.hash) {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = window.scrollY;
    if (topScrollFrameRef.current !== null) cancelAnimationFrame(topScrollFrameRef.current);
    if (reducedMotion || start < 2) {
      window.scrollTo(0, 0);
      topScrollFrameRef.current = null;
      return;
    }

    const startedAt = performance.now();
    const step = (timestamp: number) => {
      const progress = Math.min(1, (timestamp - startedAt) / TOP_SCROLL_DURATION);
      window.scrollTo(0, start * (1 - easeOutQuart(progress)));
      if (progress < 1) {
        topScrollFrameRef.current = requestAnimationFrame(step);
      } else {
        topScrollFrameRef.current = null;
      }
    };
    topScrollFrameRef.current = requestAnimationFrame(step);
  };

  useEffect(() => () => {
    if (topScrollFrameRef.current !== null) cancelAnimationFrame(topScrollFrameRef.current);
  }, []);

  useEffect(() => {
    if (!expanded) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setExpanded(false);
      menuButtonRef.current?.focus();
    };
    const closeOnDesktop = () => {
      if (window.innerWidth > 860) setExpanded(false);
    };

    document.addEventListener("keydown", closeOnEscape);
    window.addEventListener("resize", closeOnDesktop);
    document.body.setAttribute("data-menu-open", "true");
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("resize", closeOnDesktop);
      document.body.removeAttribute("data-menu-open");
    };
  }, [expanded]);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link className={styles.brand} href="/" onClickCapture={handleBrandClick} data-brand-link>
          <Image src="/img/sooin-logo.gif" alt="" width={46} height={30} priority unoptimized />
          <span>
            <strong>SOOIN</strong>
            <small>INDUSTRY</small>
          </span>
        </Link>
        <button
          ref={menuButtonRef}
          className={styles.menuButton}
          type="button"
          aria-label={expanded ? "메뉴 닫기" : "메뉴 열기"}
          aria-controls="primary-navigation"
          aria-expanded={expanded}
          onClick={() => setExpanded((current) => !current)}
        >
          <span />
          <span />
          <span />
        </button>
        <div
          className={`${styles.backdrop} ${expanded ? styles.backdropOpen : ""}`}
          aria-hidden="true"
          onClick={() => setExpanded(false)}
        />
        <nav
          className={`${styles.navigation} ${expanded ? styles.open : ""}`}
          id="primary-navigation"
          aria-label="주요 메뉴"
        >
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setExpanded(false)} tabIndex={expanded ? 0 : undefined}>
              {item.label}
            </Link>
          ))}
          <Link className={styles.cta} href="/#contact" onClick={() => setExpanded(false)}>
            문의하기 <span aria-hidden="true">↗</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

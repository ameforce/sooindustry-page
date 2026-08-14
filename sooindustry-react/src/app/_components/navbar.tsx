"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "./navbar.module.scss";

const navItems = [
  { href: "/#company", label: "회사 소개" },
  { href: "/#capabilities", label: "주요 사업" },
  { href: "/#equipment", label: "실제 설비" },
  { href: "/#contact", label: "문의" },
] as const;

export function Navbar() {
  const [expanded, setExpanded] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link className={styles.brand} href="/">
          <Image src="/img/sooin-logo.gif" alt="" width={46} height={30} priority unoptimized />
          <span>
            <strong>SOOIN</strong>
            <small>INDUSTRY</small>
          </span>
        </Link>
        <button
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
        <nav
          className={`${styles.navigation} ${expanded ? styles.open : ""}`}
          id="primary-navigation"
          aria-label="주요 메뉴"
        >
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setExpanded(false)}>
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

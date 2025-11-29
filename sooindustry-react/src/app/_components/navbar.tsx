/* eslint-disable @next/next/no-img-element */
"use client";

import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { navLinks } from "@/data/navigation";

export function Navbar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setExpanded(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const isNowScrolled = window.scrollY > 40;
      setScrolled((prev) => (prev === isNowScrolled ? prev : isNowScrolled));
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const activeHrefSet = useMemo(() => {
    if (!pathname) {
      return new Set<string>();
    }
    const normalized = pathname === "/" ? "/home" : pathname;
    return new Set([normalized]);
  }, [pathname]);

  return (
    <nav
      className={clsx("navbar navbar-expand-lg fixed-top sooin-navbar", {
        "navbar-transparent": !scrolled,
        "navbar-solid": scrolled,
      })}
    >
      <div className="container">
        <div className="navbar-translate">
          <Link className="navbar-brand d-flex align-items-center gap-2" href="/home">
            <Image src="/img/sooin-logo.gif" alt="SOOIN Industry" width={40} height={26} />
            SOOIN Industry
          </Link>
          <button
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={expanded}
            className={clsx("navbar-toggler navbar-burger", { toggled: expanded })}
            onClick={() => setExpanded((prev) => !prev)}
          >
            <span className="navbar-toggler-bar" />
            <span className="navbar-toggler-bar" />
            <span className="navbar-toggler-bar" />
          </button>
        </div>

        <div
          className={clsx("sooin-nav-collapse", { "is-open": expanded })}
          id="navbarToggler"
        >
          <ul className="navbar-nav">
            {navLinks.map((link) => (
              <li
                key={link.href}
                className={clsx("nav-item", {
                  active:
                    activeHrefSet.has(link.href) ||
                    (link.href !== "/home" && pathname?.startsWith(link.href)),
                })}
              >
                <Link className="nav-link d-flex align-items-center gap-2" href={link.href}>
                  <i className={link.icon} aria-hidden="true" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}

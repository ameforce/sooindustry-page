"use client";

import { useEffect, useState } from "react";
import styles from "./precision-home.module.scss";

const VISIBILITY_OFFSET = 640;

export function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setVisible(window.scrollY >= VISIBILITY_OFFSET);
    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  const moveToTop = () => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      className={styles.backToTop}
      aria-label="페이지 맨 위로 이동"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      data-back-to-top
      data-visible={visible ? "true" : "false"}
      onClick={moveToTop}
    >
      <span aria-hidden="true">↑</span>
      <small>TOP</small>
    </button>
  );
}

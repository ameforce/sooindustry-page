"use client";

import { useLayoutEffect, useRef } from "react";
import styles from "./precision-home.module.scss";

const SCROLL_DURATION_MIN = 560;
const SCROLL_DURATION_MAX = 960;
const ARRIVAL_DURATION = 980;

function easeInOutQuint(progress: number) {
  return progress < 0.5
    ? 16 * progress ** 5
    : 1 - (-2 * progress + 2) ** 5 / 2;
}

function normalizePath(pathname: string) {
  return pathname.replace(/\/+$/, "") || "/";
}

function documentTop(target: HTMLElement) {
  let top = 0;
  let element: HTMLElement | null = target;
  while (element) {
    top += element.offsetTop;
    element = element.offsetParent instanceof HTMLElement ? element.offsetParent : null;
  }
  return top;
}

function isReloadNavigation() {
  const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  return navigation?.type === "reload";
}

export function AnchorNavigationDirector({ scopeId }: Readonly<{ scopeId: string }>) {
  const progressRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const scope = document.getElementById(scopeId);
    const progress = progressRef.current;
    if (!scope || !progress) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animationFrame = 0;
    let historyFrame = 0;
    let progressTimer = 0;
    let arrivalTimer = 0;
    let previousScrollBehavior: string | null = null;

    const beginControlledScroll = () => {
      if (previousScrollBehavior !== null) return;
      previousScrollBehavior = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = "auto";
    };

    const restoreScrollBehavior = () => {
      if (previousScrollBehavior === null) return;
      document.documentElement.style.scrollBehavior = previousScrollBehavior;
      previousScrollBehavior = null;
    };

    const clearActiveMotion = () => {
      cancelAnimationFrame(animationFrame);
      window.clearTimeout(progressTimer);
      restoreScrollBehavior();
      scope.removeAttribute("data-anchor-scrolling");
      scope.removeAttribute("data-reload-resetting");
      progress.style.setProperty("--anchor-progress", "0");
    };

    const markArrival = (target: HTMLElement) => {
      scope.querySelector<HTMLElement>("[data-anchor-arriving]")?.removeAttribute("data-anchor-arriving");
      window.clearTimeout(arrivalTimer);
      if (reducedMotion.matches) return;

      target.setAttribute("data-anchor-arriving", "true");
      arrivalTimer = window.setTimeout(() => {
        target.removeAttribute("data-anchor-arriving");
      }, ARRIVAL_DURATION);
    };

    const focusDestination = (target: HTMLElement) => {
      const labelledBy = target.getAttribute("aria-labelledby");
      const heading = labelledBy ? document.getElementById(labelledBy) : null;
      const destination = heading instanceof HTMLElement ? heading : target;
      destination.setAttribute("tabindex", "-1");
      destination.focus({ preventScroll: true });
      destination.addEventListener("blur", () => destination.removeAttribute("tabindex"), { once: true });
    };

    const finish = (target: HTMLElement, moveFocus: boolean) => {
      progress.style.setProperty("--anchor-progress", "1");
      restoreScrollBehavior();
      markArrival(target);
      if (moveFocus) focusDestination(target);
      progressTimer = window.setTimeout(clearActiveMotion, reducedMotion.matches ? 0 : 220);
    };

    const scrollToTarget = (target: HTMLElement, moveFocus = false, immediate = false) => {
      clearActiveMotion();
      const headerHeight = Number.parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue("--header-height"),
      ) || 0;
      const start = window.scrollY;
      const destination = Math.max(
        0,
        documentTop(target) - headerHeight - 18,
      );
      const distance = destination - start;

      // Initial direct hash navigation is positioned synchronously to avoid a visible top-to-section replay.
      if (immediate) {
        beginControlledScroll();
        window.scrollTo(0, destination);
        restoreScrollBehavior();
        if (moveFocus) focusDestination(target);
        return;
      }

      if (reducedMotion.matches || Math.abs(distance) < 2) {
        beginControlledScroll();
        window.scrollTo(0, destination);
        finish(target, moveFocus);
        return;
      }

      const duration = Math.min(
        SCROLL_DURATION_MAX,
        Math.max(SCROLL_DURATION_MIN, 500 + Math.abs(distance) * 0.12),
      );
      const startedAt = performance.now();
      beginControlledScroll();
      scope.setAttribute("data-anchor-scrolling", "true");

      const step = (timestamp: number) => {
        const elapsed = Math.min(1, (timestamp - startedAt) / duration);
        const eased = easeInOutQuint(elapsed);
        progress.style.setProperty("--anchor-progress", String(elapsed));
        window.scrollTo(0, start + distance * eased);

        if (elapsed < 1) {
          animationFrame = requestAnimationFrame(step);
          return;
        }
        finish(target, moveFocus);
      };

      animationFrame = requestAnimationFrame(step);
    };

    const scrollToTopAfterReload = () => {
      clearActiveMotion();
      const start = window.scrollY;
      if (reducedMotion.matches || start < 2) {
        beginControlledScroll();
        window.scrollTo(0, 0);
        restoreScrollBehavior();
        return;
      }

      const duration = Math.min(
        SCROLL_DURATION_MAX,
        Math.max(SCROLL_DURATION_MIN, 420 + start * 0.1),
      );
      const startedAt = performance.now();
      beginControlledScroll();
      scope.setAttribute("data-reload-resetting", "true");

      const step = (timestamp: number) => {
        const elapsed = Math.min(1, (timestamp - startedAt) / duration);
        window.scrollTo(0, start * (1 - easeInOutQuint(elapsed)));
        if (elapsed < 1) {
          animationFrame = requestAnimationFrame(step);
          return;
        }
        restoreScrollBehavior();
        scope.removeAttribute("data-reload-resetting");
      };

      animationFrame = requestAnimationFrame(step);
    };

    const targetFromHash = (hash: string) => {
      if (!hash || hash === "#main-content") return null;
      let id: string;
      try {
        id = decodeURIComponent(hash.slice(1));
      } catch {
        return null;
      }
      const target = document.getElementById(id);
      return target instanceof HTMLElement && target.hasAttribute("data-anchor-target") ? target : null;
    };

    const handleClick = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (!(event.target instanceof Element)) return;

      const link = event.target.closest<HTMLAnchorElement>("a[href]");
      if (!link || link.hasAttribute("download") || (link.target && link.target !== "_self")) return;

      const url = new URL(link.href, window.location.href);
      if (
        url.origin !== window.location.origin ||
        normalizePath(url.pathname) !== normalizePath(window.location.pathname)
      ) return;

      const target = targetFromHash(url.hash);
      if (!target) return;

      event.preventDefault();
      if (window.location.hash === url.hash) {
        window.history.replaceState(null, "", url.hash);
      } else {
        window.history.pushState(null, "", url.hash);
      }

      requestAnimationFrame(() => scrollToTarget(target, event.detail === 0));
    };

    const handleHistoryNavigation = () => {
      const target = targetFromHash(window.location.hash);
      cancelAnimationFrame(historyFrame);
      if (target) historyFrame = requestAnimationFrame(() => scrollToTarget(target));
    };

    const initialHash = window.location.hash;
    if (isReloadNavigation()) {
      if (initialHash) {
        window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
      }
      historyFrame = requestAnimationFrame(scrollToTopAfterReload);
    } else if (initialHash) {
      historyFrame = requestAnimationFrame(() => {
        const target = targetFromHash(initialHash);
        if (target) scrollToTarget(target, false, true);
      });
    }

    document.addEventListener("click", handleClick, true);
    window.addEventListener("hashchange", handleHistoryNavigation);
    window.addEventListener("popstate", handleHistoryNavigation);

    return () => {
      clearActiveMotion();
      cancelAnimationFrame(historyFrame);
      window.clearTimeout(arrivalTimer);
      document.removeEventListener("click", handleClick, true);
      window.removeEventListener("hashchange", handleHistoryNavigation);
      window.removeEventListener("popstate", handleHistoryNavigation);
    };
  }, [scopeId]);

  return (
    <div className={styles.anchorProgress} ref={progressRef} aria-hidden="true">
      <span />
    </div>
  );
}

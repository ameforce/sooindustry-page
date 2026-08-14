"use client";

import { useEffect } from "react";

const DRAG_THRESHOLD = 6;

export function DragScrollDirector({ scopeId }: Readonly<{ scopeId: string }>) {
  useEffect(() => {
    const scope = document.getElementById(scopeId);
    if (!scope) return;

    const cleanups = Array.from(scope.querySelectorAll<HTMLElement>("[data-mobile-rail]")).map((rail) => {
      const railName = rail.dataset.mobileRail;
      const range = railName
        ? scope.querySelector<HTMLInputElement>(`[data-rail-range="${railName}"]`)
        : null;
      const count = railName
        ? scope.querySelector<HTMLOutputElement>(`[data-rail-count="${railName}"]`)
        : null;
      const itemCount = rail.children.length;
      let pointerId: number | null = null;
      let startX = 0;
      let startScrollLeft = 0;
      let dragged = false;
      let suppressClick = false;
      let clickResetTimer: number | null = null;

      const updateRailNavigator = () => {
        const maxScroll = Math.max(rail.scrollWidth - rail.clientWidth, 0);
        const progress = maxScroll > 0 ? Math.min(100, Math.max(0, (rail.scrollLeft / maxScroll) * 100)) : 0;
        const currentItem = maxScroll > 0
          ? Math.min(itemCount, Math.max(1, Math.round((rail.scrollLeft / maxScroll) * (itemCount - 1)) + 1))
          : 1;

        if (range) {
          range.value = String(progress);
          range.style.setProperty("--rail-progress", `${progress}%`);
        }
        if (count) count.value = `${String(currentItem).padStart(2, "0")} / ${String(itemCount).padStart(2, "0")}`;
      };

      const onRangeInput = () => {
        if (!range) return;
        const maxScroll = Math.max(rail.scrollWidth - rail.clientWidth, 0);
        rail.scrollLeft = (Number(range.value) / 100) * maxScroll;
        updateRailNavigator();
      };

      const finishDrag = (event: PointerEvent, preserveClickSuppression: boolean) => {
        if (pointerId !== event.pointerId) return;

        const capturedPointerId = pointerId;
        pointerId = null;
        rail.removeAttribute("data-dragging");

        if (rail.hasPointerCapture(capturedPointerId)) {
          rail.releasePointerCapture(capturedPointerId);
        }

        if (preserveClickSuppression) {
          clickResetTimer = window.setTimeout(() => {
            suppressClick = false;
            clickResetTimer = null;
          }, 0);
        } else {
          suppressClick = false;
        }
      };

      const onPointerDown = (event: PointerEvent) => {
        if (!event.isPrimary || event.button !== 0 || event.pointerType === "touch") return;
        if (rail.scrollWidth <= rail.clientWidth) return;

        pointerId = event.pointerId;
        startX = event.clientX;
        startScrollLeft = rail.scrollLeft;
        dragged = false;
        suppressClick = false;
        if (clickResetTimer !== null) window.clearTimeout(clickResetTimer);
        clickResetTimer = null;
        rail.setPointerCapture(event.pointerId);
        rail.setAttribute("data-dragging", "true");
      };

      const onPointerMove = (event: PointerEvent) => {
        if (pointerId !== event.pointerId) return;

        const deltaX = event.clientX - startX;
        if (!dragged && Math.abs(deltaX) < DRAG_THRESHOLD) return;

        dragged = true;
        suppressClick = true;
        event.preventDefault();
        rail.scrollLeft = startScrollLeft - deltaX;
      };

      const onPointerUp = (event: PointerEvent) => finishDrag(event, dragged);
      const onPointerCancel = (event: PointerEvent) => finishDrag(event, false);
      const onClickCapture = (event: MouseEvent) => {
        if (!suppressClick) return;
        event.preventDefault();
        event.stopPropagation();
        suppressClick = false;
        if (clickResetTimer !== null) window.clearTimeout(clickResetTimer);
        clickResetTimer = null;
      };

      rail.addEventListener("pointerdown", onPointerDown);
      rail.addEventListener("pointermove", onPointerMove);
      rail.addEventListener("pointerup", onPointerUp);
      rail.addEventListener("pointercancel", onPointerCancel);
      rail.addEventListener("click", onClickCapture, true);
      rail.addEventListener("scroll", updateRailNavigator, { passive: true });
      range?.addEventListener("input", onRangeInput);
      window.addEventListener("resize", updateRailNavigator);
      updateRailNavigator();

      return () => {
        if (clickResetTimer !== null) window.clearTimeout(clickResetTimer);
        rail.removeEventListener("pointerdown", onPointerDown);
        rail.removeEventListener("pointermove", onPointerMove);
        rail.removeEventListener("pointerup", onPointerUp);
        rail.removeEventListener("pointercancel", onPointerCancel);
        rail.removeEventListener("click", onClickCapture, true);
        rail.removeEventListener("scroll", updateRailNavigator);
        range?.removeEventListener("input", onRangeInput);
        window.removeEventListener("resize", updateRailNavigator);
      };
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [scopeId]);

  return null;
}

"use client";

import { useEffect } from "react";

const DRAG_THRESHOLD = 6;

export function DragScrollDirector({ scopeId }: Readonly<{ scopeId: string }>) {
  useEffect(() => {
    const scope = document.getElementById(scopeId);
    if (!scope) return;

    const cleanups = Array.from(scope.querySelectorAll<HTMLElement>("[data-mobile-rail]")).map((rail) => {
      let pointerId: number | null = null;
      let startX = 0;
      let startScrollLeft = 0;
      let dragged = false;
      let suppressClick = false;
      let clickResetTimer: number | null = null;

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

      return () => {
        if (clickResetTimer !== null) window.clearTimeout(clickResetTimer);
        rail.removeEventListener("pointerdown", onPointerDown);
        rail.removeEventListener("pointermove", onPointerMove);
        rail.removeEventListener("pointerup", onPointerUp);
        rail.removeEventListener("pointercancel", onPointerCancel);
        rail.removeEventListener("click", onClickCapture, true);
      };
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [scopeId]);

  return null;
}

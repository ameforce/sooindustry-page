"use client";

import { useEffect } from "react";

const DRAG_THRESHOLD = 6;
const TOUCH_SWIPE_THRESHOLD = 36;
const CLICK_SUPPRESSION_DURATION = 320;

type GestureAxis = "pending" | "horizontal" | "vertical";

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
      let touchId: number | null = null;
      let startX = 0;
      let startY = 0;
      let startScrollLeft = 0;
      let gestureAxis: GestureAxis = "pending";
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

      const scheduleClickReset = () => {
        if (!suppressClick) return;
        if (clickResetTimer !== null) window.clearTimeout(clickResetTimer);
        clickResetTimer = window.setTimeout(() => {
          suppressClick = false;
          clickResetTimer = null;
        }, CLICK_SUPPRESSION_DURATION);
      };

      const startGesture = (x: number, y: number) => {
        startX = x;
        startY = y;
        startScrollLeft = rail.scrollLeft;
        gestureAxis = "pending";
        dragged = false;
        suppressClick = false;
        if (clickResetTimer !== null) window.clearTimeout(clickResetTimer);
        clickResetTimer = null;
      };

      const startHorizontalDrag = (capturedPointerId?: number) => {
        gestureAxis = "horizontal";
        dragged = true;
        suppressClick = true;
        rail.setAttribute("data-dragging", "true");
        if (capturedPointerId !== undefined && !rail.hasPointerCapture(capturedPointerId)) {
          rail.setPointerCapture(capturedPointerId);
        }
      };

      const stopDragging = (preserveClickSuppression: boolean) => {
        const wasDragged = dragged;
        gestureAxis = "pending";
        dragged = false;
        rail.removeAttribute("data-dragging");

        if (preserveClickSuppression && wasDragged) scheduleClickReset();
        else suppressClick = false;
      };

      const finishPointerDrag = (event: PointerEvent, preserveClickSuppression: boolean) => {
        if (pointerId !== event.pointerId) return;

        const capturedPointerId = pointerId;
        pointerId = null;
        if (rail.hasPointerCapture(capturedPointerId)) rail.releasePointerCapture(capturedPointerId);
        stopDragging(preserveClickSuppression);
      };

      const findTouch = (event: TouchEvent) => {
        if (touchId === null) return null;
        return Array.from(event.touches).find((touch) => touch.identifier === touchId)
          ?? Array.from(event.changedTouches).find((touch) => touch.identifier === touchId)
          ?? null;
      };

      const resetTouchGesture = () => {
        touchId = null;
        gestureAxis = "pending";
        dragged = false;
        suppressClick = false;
        rail.removeAttribute("data-dragging");
      };

      const moveTouchRailByCard = (direction: -1 | 1) => {
        const maxScroll = Math.max(rail.scrollWidth - rail.clientWidth, 0);
        if (maxScroll <= 0) return;

        const railLeft = rail.getBoundingClientRect().left;
        const targets = Array.from(rail.children).map((child) =>
          Math.min(maxScroll, Math.max(0, child.getBoundingClientRect().left - railLeft + rail.scrollLeft)),
        );
        const currentIndex = targets.reduce(
          (nearest, target, index) =>
            Math.abs(target - rail.scrollLeft) < Math.abs(targets[nearest] - rail.scrollLeft) ? index : nearest,
          0,
        );
        const nextIndex = Math.min(targets.length - 1, Math.max(0, currentIndex + direction));
        const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
        rail.scrollTo({ left: targets[nextIndex], behavior });
      };

      const onPointerDown = (event: PointerEvent) => {
        // Touch has its own intent gate below; this handler adds drag-to-scroll only for mouse and pen.
        if (event.pointerType === "touch" || !event.isPrimary || event.button !== 0) return;
        if (rail.scrollWidth <= rail.clientWidth) return;

        pointerId = event.pointerId;
        startGesture(event.clientX, event.clientY);
      };

      const onPointerMove = (event: PointerEvent) => {
        if (pointerId !== event.pointerId) return;

        const deltaX = event.clientX - startX;
        const deltaY = event.clientY - startY;

        if (gestureAxis === "pending") {
          if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < DRAG_THRESHOLD) return;
          if (Math.abs(deltaY) >= Math.abs(deltaX)) {
            gestureAxis = "vertical";
            finishPointerDrag(event, false);
            return;
          }
          startHorizontalDrag(event.pointerId);
        }

        if (gestureAxis !== "horizontal") return;

        event.preventDefault();
        rail.scrollLeft = startScrollLeft - deltaX;
      };

      const onPointerUp = (event: PointerEvent) => finishPointerDrag(event, dragged);
      const onPointerCancel = (event: PointerEvent) => finishPointerDrag(event, false);
      const onTouchStart = (event: TouchEvent) => {
        if (event.touches.length !== 1 || rail.scrollWidth <= rail.clientWidth) {
          if (touchId !== null) resetTouchGesture();
          return;
        }

        const touch = event.touches[0];
        touchId = touch.identifier;
        startGesture(touch.clientX, touch.clientY);
      };

      const onTouchMove = (event: TouchEvent) => {
        if (event.touches.length !== 1) {
          if (touchId !== null) resetTouchGesture();
          return;
        }

        const touch = findTouch(event);
        if (!touch) return;

        const deltaX = touch.clientX - startX;
        const deltaY = touch.clientY - startY;

        if (gestureAxis === "pending") {
          if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < DRAG_THRESHOLD) return;
          if (Math.abs(deltaY) >= Math.abs(deltaX)) {
            // Vertical and equal-diagonal gestures remain entirely native.
            gestureAxis = "vertical";
            return;
          }
          gestureAxis = "horizontal";
        }
      };

      const finishTouchDrag = (event: TouchEvent) => {
        if (touchId === null) return;
        const endedTouch = Array.from(event.changedTouches).find((touch) => touch.identifier === touchId);
        if (!endedTouch) return;

        const shouldAdvance = gestureAxis === "horizontal" && Math.abs(endedTouch.clientX - startX) >= TOUCH_SWIPE_THRESHOLD;
        const direction: -1 | 1 = endedTouch.clientX < startX ? 1 : -1;
        resetTouchGesture();
        if (!shouldAdvance) return;

        suppressClick = true;
        moveTouchRailByCard(direction);
        scheduleClickReset();
      };

      const onTouchEnd = (event: TouchEvent) => finishTouchDrag(event);
      const onTouchCancel = () => {
        if (touchId === null) return;
        resetTouchGesture();
      };
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
      rail.addEventListener("touchstart", onTouchStart, { passive: true });
      rail.addEventListener("touchmove", onTouchMove, { passive: true });
      rail.addEventListener("touchend", onTouchEnd);
      rail.addEventListener("touchcancel", onTouchCancel);
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
        rail.removeEventListener("touchstart", onTouchStart);
        rail.removeEventListener("touchmove", onTouchMove);
        rail.removeEventListener("touchend", onTouchEnd);
        rail.removeEventListener("touchcancel", onTouchCancel);
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

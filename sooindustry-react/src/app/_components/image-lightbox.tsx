"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useLockBodyScroll } from "../_hooks/useLockBodyScroll";
import styles from "./precision-home.module.scss";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export type LightboxItem = Readonly<{
  image: string;
  title: string;
  description: string;
}>;

type LightboxKind = "capability" | "equipment";

export function ImageLightbox({
  eyebrow,
  item,
  kind,
  onClose,
  opener,
}: Readonly<{
  eyebrow: string;
  item: LightboxItem | null;
  kind: LightboxKind;
  onClose: () => void;
  opener: HTMLButtonElement | null;
}>) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = `${kind}-lightbox-title`;
  const captionId = `${kind}-lightbox-caption`;

  useLockBodyScroll(item !== null);

  useEffect(() => {
    if (!item) return;

    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      const first = focusable.at(0);
      const last = focusable.at(-1);
      if (!first || !last) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      opener?.focus({ preventScroll: true });
    };
  }, [item, onClose, opener]);

  if (!item) return null;

  return createPortal(
    <div
      className={styles.lightbox}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={captionId}
      ref={dialogRef}
      tabIndex={-1}
      data-image-lightbox={kind}
      data-capability-lightbox={kind === "capability" ? "true" : undefined}
      data-equipment-lightbox={kind === "equipment" ? "true" : undefined}
    >
      <button
        type="button"
        className={styles.lightboxBackdrop}
        aria-label="확대 이미지 닫기"
        data-lightbox-backdrop
        onClick={onClose}
      />
      <div className={styles.lightboxPanel}>
        <button
          type="button"
          className={styles.lightboxClose}
          aria-label="확대 이미지 닫기"
          data-lightbox-close
          ref={closeButtonRef}
          onClick={onClose}
        >
          <span aria-hidden="true">×</span>
          <span>닫기</span>
        </button>
        <figure className={styles.lightboxFigure}>
          <div className={styles.lightboxImage}>
            <Image
              src={item.image}
              alt={`${item.title} — ${item.description}`}
              fill
              sizes="(max-width: 760px) 92vw, min(82vw, 1180px)"
              priority
            />
          </div>
          <figcaption className={styles.lightboxCaption} id={captionId}>
            <span className={styles.lightboxEyebrow}>{eyebrow}</span>
            <strong id={titleId}>{item.title}</strong>
            <span>{item.description}</span>
          </figcaption>
        </figure>
      </div>
    </div>,
    document.body,
  );
}

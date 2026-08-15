"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { EquipmentImage } from "@/data/precisionProof";
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

export function EquipmentGallery({ items }: Readonly<{ items: ReadonlyArray<EquipmentImage> }>) {
  const [activeItem, setActiveItem] = useState<EquipmentImage | null>(null);
  const openerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useLockBodyScroll(activeItem !== null);

  const close = () => setActiveItem(null);

  useEffect(() => {
    if (!activeItem) return;

    const opener = openerRef.current;
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
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
  }, [activeItem]);

  return (
    <>
      <div className={styles.gallery} aria-label="실제 설비 사진 목록" data-mobile-rail="equipment">
        {items.map((item) => {
          const alt = `${item.title} — ${item.description}`;
          return (
            <figure
              className={item.featured ? styles.featuredFigure : styles.figure}
              key={item.image}
              data-reveal
            >
              <div className={styles.galleryImage}>
                <button
                  type="button"
                  className={styles.galleryButton}
                  aria-label={`${item.title} 확대해서 보기`}
                  data-equipment-lightbox-trigger
                  onClick={(event) => {
                    openerRef.current = event.currentTarget;
                    setActiveItem(item);
                  }}
                >
                  <Image
                    src={item.image}
                    alt={alt}
                    fill
                    sizes={item.featured ? "(max-width: 900px) 100vw, 58vw" : "(max-width: 900px) 50vw, 21vw"}
                  />
                  <span className={styles.galleryZoomHint} aria-hidden="true">확대 보기 ↗</span>
                </button>
              </div>
              <figcaption>
                <strong>{item.title}</strong>
                <span>{item.description}</span>
              </figcaption>
            </figure>
          );
        })}
      </div>

      {activeItem && createPortal(
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-labelledby="equipment-lightbox-title"
          aria-describedby="equipment-lightbox-caption"
          ref={dialogRef}
          tabIndex={-1}
          data-equipment-lightbox
        >
          <button
            type="button"
            className={styles.lightboxBackdrop}
            aria-label="확대 이미지 닫기"
            data-lightbox-backdrop
            onClick={close}
          />
          <div className={styles.lightboxPanel}>
            <button
              type="button"
              className={styles.lightboxClose}
              aria-label="확대 이미지 닫기"
              data-lightbox-close
              ref={closeButtonRef}
              onClick={close}
            >
              <span aria-hidden="true">×</span>
              <span>닫기</span>
            </button>
            <figure className={styles.lightboxFigure}>
              <div className={styles.lightboxImage}>
                <Image
                  src={activeItem.image}
                  alt={`${activeItem.title} — ${activeItem.description}`}
                  fill
                  sizes="(max-width: 760px) 92vw, min(82vw, 1180px)"
                  priority
                />
              </div>
              <figcaption className={styles.lightboxCaption} id="equipment-lightbox-caption">
                <span className={styles.lightboxEyebrow}>ACTUAL EQUIPMENT</span>
                <strong id="equipment-lightbox-title">{activeItem.title}</strong>
                <span>{activeItem.description}</span>
              </figcaption>
            </figure>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}

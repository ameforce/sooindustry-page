"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import type { EquipmentImage } from "@/data/precisionProof";
import { ImageLightbox } from "./image-lightbox";
import styles from "./precision-home.module.scss";

type ActiveEquipment = Readonly<{
  item: EquipmentImage;
  opener: HTMLButtonElement;
}>;

export function EquipmentGallery({ items }: Readonly<{ items: ReadonlyArray<EquipmentImage> }>) {
  const [active, setActive] = useState<ActiveEquipment | null>(null);
  const close = useCallback(() => setActive(null), []);

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
                  onClick={(event) => setActive({ item, opener: event.currentTarget })}
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

      <ImageLightbox
        eyebrow="ACTUAL EQUIPMENT"
        item={active?.item ?? null}
        kind="equipment"
        onClose={close}
        opener={active?.opener ?? null}
      />
    </>
  );
}

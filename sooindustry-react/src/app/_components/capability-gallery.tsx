"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import type { Capability } from "@/data/precisionProof";
import { ImageLightbox } from "./image-lightbox";
import styles from "./precision-home.module.scss";

type ActiveCapability = Readonly<{
  item: Capability;
  opener: HTMLButtonElement;
}>;

export function CapabilityGallery({ items }: Readonly<{ items: ReadonlyArray<Capability> }>) {
  const [active, setActive] = useState<ActiveCapability | null>(null);
  const close = useCallback(() => setActive(null), []);

  return (
    <>
      <div className={styles.cardGrid} aria-label="주요 열처리 설비 목록" data-mobile-rail="capabilities">
        {items.map((item) => (
          <article className={styles.capabilityCard} key={item.number} data-reveal>
            <div className={styles.cardImage}>
              <button
                type="button"
                className={styles.galleryButton}
                aria-label={`${item.title} 확대해서 보기`}
                data-capability-lightbox-trigger
                onClick={(event) => setActive({ item, opener: event.currentTarget })}
              >
                <Image src={item.image} alt={`${item.title} 실제 이미지`} fill sizes="(max-width: 700px) 100vw, 25vw" />
                <span className={styles.galleryZoomHint} aria-hidden="true">확대 보기 ↗</span>
              </button>
            </div>
            <span className={styles.cardNumber}>{item.number}</span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <Link href="#contact" aria-label={`${item.title} 설비 문의`}>
              설비 문의 <span aria-hidden="true">→</span>
            </Link>
          </article>
        ))}
      </div>

      <ImageLightbox
        eyebrow="EQUIPMENT TYPE"
        item={active?.item ?? null}
        kind="capability"
        onClose={close}
        opener={active?.opener ?? null}
      />
    </>
  );
}

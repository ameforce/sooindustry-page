"use client";

import clsx from "clsx";
import { useCallback, useEffect } from "react";
import { useLockBodyScroll } from "../_hooks/useLockBodyScroll";

type ImageModalProps = {
  open: boolean;
  image: string;
  title: string;
  onClose: () => void;
};

export function ImageModal({ open, image, title, onClose }: ImageModalProps) {
  useLockBodyScroll(open);

  const handleKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) {
      return undefined;
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey, open]);

  if (!open) {
    return null;
  }

  return (
    <div className={clsx("image-modal", { active: open })} role="dialog" aria-modal="true" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <button type="button" className="close-button" aria-label="닫기" onClick={onClose}>
          ×
        </button>
        <img src={image} alt={title} className="modal-image" loading="lazy" />
        <div className="modal-caption">{title}</div>
      </div>
    </div>
  );
}

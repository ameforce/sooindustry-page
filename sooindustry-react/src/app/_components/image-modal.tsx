"use client";

import clsx from "clsx";
import { useCallback, useEffect } from "react";
import { useLockBodyScroll } from "../_hooks/useLockBodyScroll";

type ImageModalProps = {
  open: boolean;
  image: string;
  title: string;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
};

export function ImageModal({ open, image, title, onClose, onPrev, onNext }: ImageModalProps) {
  useLockBodyScroll(open);

  const handlePrev = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      if (onPrev) onPrev();
    },
    [onPrev],
  );

  const handleNext = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      if (onNext) onNext();
    },
    [onNext],
  );

  const handleKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "ArrowLeft" && onPrev) {
        event.preventDefault();
        onPrev();
      } else if (event.key === "ArrowRight" && onNext) {
        event.preventDefault();
        onNext();
      }
    },
    [onClose, onPrev, onNext],
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
      {onPrev && (
        <button type="button" className="modal-nav prev" aria-label="이전" onClick={handlePrev} />
      )}
      {onNext && (
        <button type="button" className="modal-nav next" aria-label="다음" onClick={handleNext} />
      )}
      <div
        className="modal-content"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <button type="button" className="close-button" aria-label="닫기" onClick={onClose}>
          ×
        </button>
        <div className="modal-body">
          <img key={image} src={image} alt={title} className="modal-image" loading="lazy" />
        </div>
        <div key={title} className="modal-caption">
          {title}
        </div>
      </div>
    </div>
  );
}

"use client";

import {
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
  type MouseEvent,
} from "react";
import { createPortal } from "react-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

function Modal({ open, onClose, title, children, className = "" }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  if (!open) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={handleOverlayClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={`relative w-full max-w-[520px] mx-4 bg-white rounded-xl shadow-[0_0_0_1px_rgba(10,10,10,0.10),0_8px_40px_rgba(10,10,10,0.12)] ${className}`}
      >
        {title && (
          <div className="flex items-center justify-between px-6 pt-5 pb-3">
            <h3 className="text-lg font-[600] tracking-tight text-neutral-950">
              {title}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
              aria-label="關閉"
            >
              <XMarkIcon className="size-5" />
            </button>
          </div>
        )}
        {!title && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full p-1 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
            aria-label="關閉"
          >
            <XMarkIcon className="size-5" />
          </button>
        )}
        <div className="px-6 pb-6">{children}</div>
      </div>
    </div>,
    document.body,
  );
}

export { Modal };
export type { ModalProps };

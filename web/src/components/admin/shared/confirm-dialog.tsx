"use client";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "default";
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "確認",
  cancelLabel = "取消",
  variant = "default",
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex flex-col items-start pt-6">
        {variant === "danger" && (
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />
          </div>
        )}
        <h3 className="text-lg font-semibold tracking-tight text-neutral-950">
          {title}
        </h3>
        {description && (
          <p className="mt-2 text-sm text-neutral-500">
            {description}
          </p>
        )}
        <div className="mt-8 flex w-full justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-full border border-border px-5 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <Button
            onClick={onConfirm}
            disabled={loading}
            className={
              variant === "danger"
                ? "!bg-red-700 hover:!bg-red-800 active:!bg-red-900 shadow-sm"
                : ""
            }
          >
            {loading ? "處理中…" : confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

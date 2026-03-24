"use client";

import { type ReactNode } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface FormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  title: string;
  children: ReactNode;
  submitLabel?: string;
  loading?: boolean;
  className?: string;
}

export function FormModal({
  open,
  onClose,
  onSubmit,
  title,
  children,
  submitLabel = "儲存",
  loading = false,
  className,
}: FormModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} className={className}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(e);
        }}
      >
        <div className="space-y-4">{children}</div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-full border border-border px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:opacity-50"
          >
            取消
          </button>
          <Button type="submit" disabled={loading}>
            {loading ? "處理中…" : submitLabel}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

import type { ReactNode } from "react";

interface AdminEmptyStateProps {
  icon?: ReactNode;
  message?: string;
  colSpan?: number;
}

export function AdminEmptyState({
  message = "暫無資料",
  colSpan,
}: AdminEmptyStateProps) {
  if (colSpan) {
    return (
      <tr>
        <td colSpan={colSpan} className="h-32 text-center text-sm text-neutral-400">
          {message}
        </td>
      </tr>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <p className="text-sm text-neutral-400">{message}</p>
    </div>
  );
}

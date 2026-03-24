import { Skeleton } from "@/components/ui/loading";

interface AdminTableSkeletonProps {
  rows?: number;
  columns?: number[];
}

export function AdminTableSkeleton({
  rows = 5,
  columns = [192, 64, 56, 80],
}: AdminTableSkeletonProps) {
  return (
    <div className="space-y-0">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 border-b border-border/50 px-5 py-3"
        >
          {columns.map((w, j) => (
            <Skeleton
              key={j}
              className={`h-4 ${j === columns.length - 1 ? "ml-auto" : ""}`}
              style={{ width: w }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function AdminSpinnerLoading({ message = "載入中…" }: { message?: string }) {
  return (
    <div className="flex h-48 items-center justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      <span className="ml-3 text-sm text-neutral-500">{message}</span>
    </div>
  );
}

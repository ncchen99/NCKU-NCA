interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const spinnerSizes = {
  sm: "size-4 border-[1.5px]",
  md: "size-6 border-2",
  lg: "size-8 border-2",
};

function Spinner({ size = "md", className = "" }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="載入中"
      className={`animate-spin rounded-full border-neutral-200 border-t-primary ${spinnerSizes[size]} ${className}`}
    />
  );
}

interface SkeletonProps {
  className?: string;
}

function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-md bg-neutral-100 ${className}`}
    />
  );
}

function SkeletonText({
  lines = 3,
  className = "",
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-2.5 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-3.5 ${i === lines - 1 ? "w-2/3" : "w-full"}`}
        />
      ))}
    </div>
  );
}

function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-lg shadow-[0_0_0_1px_rgba(10,10,10,0.08)] p-5 space-y-4 ${className}`}
    >
      <Skeleton className="h-4 w-1/3" />
      <SkeletonText lines={2} />
      <Skeleton className="h-9 w-24 rounded-full" />
    </div>
  );
}

export { Spinner, Skeleton, SkeletonText, SkeletonCard };
export type { SpinnerProps, SkeletonProps };

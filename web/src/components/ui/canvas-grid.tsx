interface CanvasGridProps {
  className?: string;
}

function CanvasGrid({ className = "" }: CanvasGridProps) {
  return (
    <div
      className={`relative h-7 w-full overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-border" />
      </div>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, var(--color-border) 0px, var(--color-border) 1px, transparent 1px, transparent 48px)",
          backgroundSize: "48px 100%",
        }}
      />
    </div>
  );
}

export { CanvasGrid };
export type { CanvasGridProps };

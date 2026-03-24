import type { ReactNode } from "react";

interface StatCardProps {
  value: string | number;
  label: string;
  icon?: ReactNode;
  accent?: string;
  className?: string;
}

function StatCard({
  value,
  label,
  icon,
  accent,
  className = "",
}: StatCardProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-[0_0_0_1px_rgba(10,10,10,0.08)] p-5 ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p
            className="text-[32px] font-[700] tracking-tight leading-none"
            style={accent ? { color: accent } : undefined}
          >
            {value}
          </p>
          <p className="mt-1.5 text-sm font-[450] text-neutral-600">{label}</p>
        </div>
        {icon && (
          <div className="flex-shrink-0 rounded-lg bg-neutral-50 p-2 text-neutral-400">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

export { StatCard };
export type { StatCardProps };

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
}

function SectionHeading({ title, subtitle, className = "" }: SectionHeadingProps) {
  return (
    <div className={`flex items-baseline gap-2.5 ${className}`}>
      <h2 className="text-[22px] font-[700] tracking-tight text-neutral-950">
        {title}
      </h2>
      {subtitle && (
        <span className="text-sm font-[450] text-neutral-600">{subtitle}</span>
      )}
    </div>
  );
}

export { SectionHeading };
export type { SectionHeadingProps };

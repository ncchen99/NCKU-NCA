import { ArrowLongRightIcon } from "@heroicons/react/20/solid";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
}

function SectionHeading({
  title,
  subtitle,
  className = "",
}: SectionHeadingProps) {
  return (
    <div className={`flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:gap-2.5 ${className}`}>
      <h2 className="text-[20px] font-[700] tracking-tight text-neutral-950 sm:text-[22px]">
        {title}
      </h2>
      {subtitle && (
        <span className="text-[13px] font-[450] text-neutral-600 sm:text-sm">{subtitle}</span>
      )}
    </div>
  );
}

interface ViewAllLinkProps {
  href: string;
  label?: string;
  className?: string;
}

function ViewAllLink({
  href,
  label = "查看全部",
  className = "",
}: ViewAllLinkProps) {
  return (
    <a
      href={href}
      className={`group inline-flex items-center gap-1 text-sm font-[450] text-primary transition-colors hover:text-primary-dark ${className}`}
    >
      {label}
      <ArrowLongRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
    </a>
  );
}

export { SectionHeading, ViewAllLink };
export type { SectionHeadingProps, ViewAllLinkProps };

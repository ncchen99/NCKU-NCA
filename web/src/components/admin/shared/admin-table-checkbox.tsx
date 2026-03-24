"use client";

import { CheckIcon } from "@heroicons/react/24/solid";

type AdminTableCheckboxProps = Omit<
  React.ComponentPropsWithoutRef<"input">,
  "type" | "className"
>;

export function AdminTableCheckbox({
  "aria-label": ariaLabel,
  ...props
}: AdminTableCheckboxProps) {
  return (
    <label className="inline-flex cursor-pointer items-center justify-center">
      <input type="checkbox" className="peer sr-only" aria-label={ariaLabel} {...props} />
      <span
        className="flex h-4 w-4 shrink-0 items-center justify-center rounded border border-neutral-300 bg-white transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-primary/35 peer-focus-visible:ring-offset-2 peer-checked:border-primary peer-checked:bg-primary peer-checked:[&_svg]:opacity-100"
        aria-hidden
      >
        <CheckIcon className="h-2.5 w-2.5 text-white opacity-0 transition-opacity" />
      </span>
    </label>
  );
}

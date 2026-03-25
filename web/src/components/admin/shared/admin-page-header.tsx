"use client";

import type { ReactNode } from "react";

interface AdminPageHeaderProps {
    title: string;
    subtitle?: ReactNode;
    count?: number;
    action?: ReactNode;
}

export function AdminPageHeader({
    title,
    subtitle,
    count,
    action,
}: AdminPageHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-neutral-950">
                    {title}
                    {count !== undefined && (
                        <span className="ml-2 text-base font-normal text-neutral-400">
                            ({count})
                        </span>
                    )}
                </h1>
                {subtitle ? <div className="mt-1 text-sm text-neutral-500">{subtitle}</div> : null}
            </div>
            {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
    );
}

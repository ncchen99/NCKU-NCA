import { revalidatePath } from "next/cache";
import { CHARTER_DOCUMENTS } from "@/lib/charter-documents";
import type { Post } from "@/types";

const CHARTER_SLUGS = new Set<string>(CHARTER_DOCUMENTS.map((doc) => doc.slug));

function normalizePath(path: string): string {
    if (!path) return "/";
    return path.startsWith("/") ? path : `/${path}`;
}

function revalidatePaths(paths: Iterable<string>) {
    for (const path of new Set(paths)) {
        revalidatePath(path);
    }
}

export function revalidateSiteContentPaths(pageId: string): void {
    const normalizedPageId = pageId.trim();
    if (!normalizedPageId) return;

    const paths = new Set<string>(["/"]);

    if (normalizedPageId === "about" || normalizedPageId === "members") {
        paths.add(`/${normalizedPageId}`);
    } else if (CHARTER_SLUGS.has(normalizedPageId)) {
        paths.add(`/charter/${normalizedPageId}`);
        paths.add("/sitemap.xml");
    } else {
        paths.add(normalizePath(normalizedPageId));
    }

    revalidatePaths(paths);
}

type PostSnapshot = Pick<Post, "slug" | "category"> | null | undefined;

function getPostPaths(post: PostSnapshot): string[] {
    if (!post?.slug || !post.category) return [];

    if (post.category === "news") {
        return ["/news", `/news/${post.slug}`];
    }

    if (post.category === "activity_review") {
        return ["/activities", `/activities/${post.slug}`];
    }

    return [];
}

export function revalidatePostPaths(previousPost?: PostSnapshot, nextPost?: PostSnapshot): void {
    const paths = new Set<string>(["/"]);

    for (const p of getPostPaths(previousPost)) {
        paths.add(p);
    }

    for (const p of getPostPaths(nextPost)) {
        paths.add(p);
    }

    paths.add("/sitemap.xml");
    revalidatePaths(paths);
}

export function revalidateFormPaths(formId?: string): void {
    const paths = new Set<string>(["/", "/sitemap.xml"]);

    const normalizedFormId = formId?.trim();
    if (normalizedFormId) {
        paths.add(`/forms/${normalizedFormId}`);
    }

    revalidatePaths(paths);
}

export function revalidateAttendancePaths(): void {
    revalidatePaths(["/attendance", "/sitemap.xml"]);
}

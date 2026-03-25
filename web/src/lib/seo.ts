const FALLBACK_SITE_URL = "http://localhost:3000";

function normalizeSiteUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return FALLBACK_SITE_URL;
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export function getSiteUrl(): URL {
  const raw = process.env.NEXT_PUBLIC_BASE_URL ?? FALLBACK_SITE_URL;
  try {
    return new URL(normalizeSiteUrl(raw));
  } catch {
    return new URL(FALLBACK_SITE_URL);
  }
}

export function toAbsoluteUrl(pathname: string): string {
  return new URL(pathname, getSiteUrl()).toString();
}

export function buildOgImageUrl(input?: {
  title?: string;
  subtitle?: string;
  path?: string;
}): string {
  const url = new URL("/og", getSiteUrl());
  if (input?.title) url.searchParams.set("title", input.title);
  if (input?.subtitle) url.searchParams.set("subtitle", input.subtitle);
  if (input?.path) url.searchParams.set("path", input.path);
  return url.toString();
}

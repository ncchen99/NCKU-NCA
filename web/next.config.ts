import type { NextConfig } from "next";

function getHostnameFromUrl(urlString?: string): string | null {
  if (!urlString) return null;
  try {
    return new URL(urlString).hostname;
  } catch {
    return null;
  }
}

const r2PublicHostname =
  getHostnameFromUrl(process.env.CLOUDFLARE_R2_PUBLIC_BASE_URL) ??
  getHostnameFromUrl(process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_URL);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      ...(r2PublicHostname
        ? [
          {
            protocol: "https" as const,
            hostname: r2PublicHostname,
          },
        ]
        : []),
    ],
  },
};

export default nextConfig;

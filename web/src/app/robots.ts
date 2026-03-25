import type { MetadataRoute } from "next";
import { toAbsoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/admin", "/api/auth", "/api/revalidate"],
    },
    sitemap: toAbsoluteUrl("/sitemap.xml"),
  };
}

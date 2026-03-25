import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "__session";
const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function getOrigin(value: string | null): string | null {
  if (!value) return null;
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get(SESSION_COOKIE)?.value;

  if (pathname.startsWith("/api") && MUTATING_METHODS.has(request.method)) {
    // Revalidate endpoint is secret-protected and may be called by external systems.
    if (!pathname.startsWith("/api/revalidate")) {
      const expectedOrigin = request.nextUrl.origin;
      const origin = getOrigin(request.headers.get("origin"));
      const refererOrigin = getOrigin(request.headers.get("referer"));
      const isSameOrigin = origin === expectedOrigin || refererOrigin === expectedOrigin;

      if (!isSameOrigin) {
        return NextResponse.json({ error: "CSRF 驗證失敗" }, { status: 403 });
      }
    }
  }

  if (pathname.startsWith("/api/admin")) {
    if (!session) {
      return NextResponse.json({ error: "未授權" }, { status: 401 });
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      const redirect = `${pathname}${request.nextUrl.search}`;
      loginUrl.searchParams.set("redirect", redirect);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};

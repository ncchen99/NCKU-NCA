import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";

const SESSION_COOKIE = "__session";
const SESSION_EXPIRY_MS = 60 * 60 * 24 * 5 * 1000; // 5 days
const ALLOWED_EMAIL_SUFFIX = "@gs.ncku.edu.tw";

export async function POST(request: Request) {
  try {
    const { idToken } = (await request.json()) as { idToken?: string };
    if (!idToken) {
      return NextResponse.json({ error: "缺少 idToken" }, { status: 400 });
    }

    const adminAuth = getAdminAuth();
    const adminDb = getAdminDb();
    const decoded = await adminAuth.verifyIdToken(idToken);

    if (!decoded.email?.endsWith(ALLOWED_EMAIL_SUFFIX)) {
      return NextResponse.json(
        { error: "僅限 @gs.ncku.edu.tw 信箱" },
        { status: 403 },
      );
    }

    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_EXPIRY_MS,
    });

    const isProduction = process.env.NODE_ENV === "production";
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, sessionCookie, {
      maxAge: SESSION_EXPIRY_MS / 1000,
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
    });

    const userDoc = await adminDb.collection("users").doc(decoded.uid).get();
    const role = userDoc.exists
      ? (userDoc.data()?.role as string)
      : "club_member";

    return NextResponse.json({ status: "ok", role });
  } catch (err) {
    console.error("Session creation error:", err);
    return NextResponse.json(
      { error: "Session 建立失敗" },
      { status: 401 },
    );
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get(SESSION_COOKIE)?.value;

    if (session) {
      try {
        const adminAuth = getAdminAuth();
        const decoded = await adminAuth.verifySessionCookie(session);
        await adminAuth.revokeRefreshTokens(decoded.uid);
      } catch {
        // Session already invalid — clear cookie regardless
      }
    }

    cookieStore.set(SESSION_COOKIE, "", {
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return NextResponse.json({ status: "ok" });
  } catch (err) {
    console.error("Session deletion error:", err);
    return NextResponse.json(
      { error: "登出失敗" },
      { status: 500 },
    );
  }
}

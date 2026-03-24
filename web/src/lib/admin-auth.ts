import { cookies } from "next/headers";
import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";

const SESSION_COOKIE = "__session";

export interface AdminSession {
  uid: string;
  email: string;
  role: string;
}

/**
 * Verifies that the current request is from an authenticated admin user.
 * Returns the admin session info, or null if not authorized.
 */
export async function verifyAdmin(): Promise<AdminSession | null> {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get(SESSION_COOKIE)?.value;
    if (!session) return null;

    const adminAuth = getAdminAuth();
    const decoded = await adminAuth.verifySessionCookie(session, true);

    const adminDb = getAdminDb();
    const userDoc = await adminDb.collection("users").doc(decoded.uid).get();
    const role = userDoc.exists ? (userDoc.data()?.role as string) : null;

    if (role !== "admin") return null;

    return {
      uid: decoded.uid,
      email: decoded.email ?? "",
      role,
    };
  } catch {
    return null;
  }
}

/**
 * Helper to create a 401/403 JSON response for unauthorized requests.
 */
export function unauthorizedResponse(message = "未授權的操作") {
  return Response.json({ error: message }, { status: 403 });
}

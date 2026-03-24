import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminAuth } from "@/lib/firebase-admin";

const SESSION_COOKIE = "__session";
type Role = "admin" | "club_member";

async function getCallerUid(): Promise<string | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE)?.value;
  if (!session) return null;
  try {
    const adminAuth = getAdminAuth();
    const decoded = await adminAuth.verifySessionCookie(session, true);
    return decoded.uid;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const callerUid = await getCallerUid();
    if (!callerUid) {
      return NextResponse.json({ error: "未授權" }, { status: 401 });
    }

    const adminAuth = getAdminAuth();
    const callerRecord = await adminAuth.getUser(callerUid);
    if (callerRecord.customClaims?.role !== "admin") {
      return NextResponse.json(
        { error: "僅限管理員操作" },
        { status: 403 },
      );
    }

    const { uid, role } = (await request.json()) as {
      uid?: string;
      role?: Role;
    };

    if (!uid || !role) {
      return NextResponse.json(
        { error: "缺少 uid 或 role" },
        { status: 400 },
      );
    }

    const validRoles: Role[] = ["admin", "club_member"];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: "無效的角色，請使用 admin 或 club_member" },
        { status: 400 },
      );
    }

    await getAdminAuth().setCustomUserClaims(uid, { role });

    return NextResponse.json({
      status: "ok",
      message: `已將使用者 ${uid} 設為 ${role}`,
    });
  } catch (err) {
    console.error("Set claims error:", err);
    return NextResponse.json(
      { error: "設定權限失敗" },
      { status: 500 },
    );
  }
}

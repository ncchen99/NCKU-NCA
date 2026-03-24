import { NextRequest } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { getAllClubs } from "@/lib/firestore";

export async function GET(req: NextRequest) {
  const admin = await verifyAdmin();
  if (!admin) return unauthorizedResponse();

  try {
    const { searchParams } = req.nextUrl;
    const category = searchParams.get("category") ?? undefined;
    const isActiveParam = searchParams.get("isActive");
    const isActive =
      isActiveParam === "true"
        ? true
        : isActiveParam === "false"
          ? false
          : undefined;

    const clubs = await getAllClubs({ category, isActive });
    return Response.json({ clubs });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "取得社團列表失敗" },
      { status: 500 }
    );
  }
}

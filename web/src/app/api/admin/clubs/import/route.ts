import { NextRequest } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { importClubs } from "@/lib/firestore";

export async function POST(req: NextRequest) {
  const admin = await verifyAdmin();
  if (!admin) return unauthorizedResponse();

  try {
    const body = await req.json();
    const { clubs } = body;

    if (!Array.isArray(clubs) || clubs.length === 0) {
      return Response.json(
        { error: "請提供有效的社團資料陣列" },
        { status: 400 }
      );
    }

    const result = await importClubs(clubs);
    return Response.json(result);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "匯入社團失敗" },
      { status: 500 }
    );
  }
}

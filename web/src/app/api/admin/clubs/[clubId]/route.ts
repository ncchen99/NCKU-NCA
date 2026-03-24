import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { getClub, updateClub } from "@/lib/firestore";

type RouteContext = { params: Promise<{ clubId: string }> };

export async function GET(_req: NextRequest, context: RouteContext) {
  const admin = await verifyAdmin();
  if (!admin) return unauthorizedResponse();
  const { clubId } = await context.params;
  const club = await getClub(clubId);
  if (!club) return NextResponse.json({ error: "找不到社團" }, { status: 404 });
  return NextResponse.json(club);
}

export async function PUT(req: NextRequest, context: RouteContext) {
  const admin = await verifyAdmin();
  if (!admin) return unauthorizedResponse();
  const { clubId } = await context.params;
  const data = await req.json();
  await updateClub(clubId, data);
  return NextResponse.json({ success: true });
}

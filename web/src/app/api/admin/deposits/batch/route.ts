import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { batchUpdateDepositStatus } from "@/lib/firestore";

export async function PUT(request: NextRequest) {
  const session = await verifyAdmin();
  if (!session) return unauthorizedResponse();

  try {
    const { ids, status } = await request.json();
    await batchUpdateDepositStatus(ids, status, session.uid);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "批次更新保證金狀態失敗" },
      { status: 500 }
    );
  }
}

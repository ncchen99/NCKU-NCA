import { NextRequest } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import {
  getAllAttendanceEvents,
  createAttendanceEvent,
} from "@/lib/firestore";

export async function GET() {
  const admin = await verifyAdmin();
  if (!admin) return unauthorizedResponse();

  try {
    const events = await getAllAttendanceEvents();
    return Response.json({ events });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "取得點名活動列表失敗" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const admin = await verifyAdmin();
  if (!admin) return unauthorizedResponse();

  try {
    const body = await req.json();
    const eventId = await createAttendanceEvent({
      ...body,
      created_by: admin.uid,
    });
    return Response.json({ id: eventId }, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "建立點名活動失敗" },
      { status: 500 }
    );
  }
}

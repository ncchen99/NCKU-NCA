import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { getFormResponses } from "@/lib/firestore";

type RouteContext = { params: Promise<{ formId: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  const session = await verifyAdmin();
  if (!session) return unauthorizedResponse();

  try {
    const { formId } = await context.params;
    const responses = await getFormResponses(formId);
    return NextResponse.json(responses);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "取得表單回應失敗" },
      { status: 500 }
    );
  }
}

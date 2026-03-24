import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { getForm, updateForm, deleteForm } from "@/lib/firestore";

type RouteContext = { params: Promise<{ formId: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  const session = await verifyAdmin();
  if (!session) return unauthorizedResponse();

  try {
    const { formId } = await context.params;
    const form = await getForm(formId);
    if (!form) {
      return NextResponse.json({ error: "表單不存在" }, { status: 404 });
    }
    return NextResponse.json(form);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "取得表單失敗" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const session = await verifyAdmin();
  if (!session) return unauthorizedResponse();

  try {
    const { formId } = await context.params;
    const body = await request.json();
    await updateForm(formId, body);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "更新表單失敗" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const session = await verifyAdmin();
  if (!session) return unauthorizedResponse();

  try {
    const { formId } = await context.params;
    await deleteForm(formId);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "刪除表單失敗" },
      { status: 500 }
    );
  }
}

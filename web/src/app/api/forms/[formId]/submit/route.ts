import { verifyUserSession } from "@/lib/session-auth";
import { getForm, submitFormResponse } from "@/lib/firestore/forms";
import { anyTimestampToDate } from "@/lib/datetime";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ formId: string }> }
) {
  const session = await verifyUserSession();
  if (!session) {
    return Response.json({ error: "請先登入" }, { status: 401 });
  }

  const { formId } = await params;

  try {
    const body = (await request.json()) as {
      club_id?: string;
      answers?: Record<string, unknown>;
    };

    const clubId = body.club_id?.trim();
    const answers = body.answers;

    if (!clubId) {
      return Response.json({ error: "缺少 club_id" }, { status: 400 });
    }
    if (!answers || typeof answers !== "object") {
      return Response.json({ error: "缺少回答內容" }, { status: 400 });
    }

    // 驗證表單是否存在且開放
    const form = await getForm(formId);
    if (!form) {
      return Response.json({ error: "查無此表單" }, { status: 404 });
    }

    const closesAt = anyTimestampToDate(form.closes_at);
    const isClosed =
      form.status === "closed" || (closesAt && closesAt < new Date());

    if (isClosed) {
      return Response.json({ error: "此表單已截止" }, { status: 403 });
    }

    // 驗證必填欄位
    for (const field of form.fields ?? []) {
      if (field.type === "section_header") continue;
      if (!field.required) continue;

      const val = answers[field.id];
      if (
        val === undefined ||
        val === null ||
        val === "" ||
        (Array.isArray(val) && val.length === 0)
      ) {
        return Response.json(
          { error: `${field.label} 為必填欄位` },
          { status: 400 }
        );
      }
    }

    const responseId = await submitFormResponse(formId, {
      form_id: formId,
      club_id: clubId,
      submitted_by_uid: session.uid,
      answers,
    });

    return Response.json({ ok: true, response_id: responseId });
  } catch (error) {
    console.error("Form submit error:", error);
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "送出表單失敗",
      },
      { status: 500 }
    );
  }
}

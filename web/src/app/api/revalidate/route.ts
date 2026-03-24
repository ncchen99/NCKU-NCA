import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  try {
    const { path, secret } = (await request.json()) as {
      path?: string;
      secret?: string;
    };

    if (!secret || secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ error: "無效的 secret" }, { status: 401 });
    }

    if (!path) {
      return NextResponse.json({ error: "缺少 path 參數" }, { status: 400 });
    }

    revalidatePath(path);

    return NextResponse.json({
      status: "ok",
      revalidated: true,
      path,
      now: Date.now(),
    });
  } catch (err) {
    console.error("Revalidation error:", err);
    return NextResponse.json(
      { error: "Revalidation 失敗" },
      { status: 500 },
    );
  }
}

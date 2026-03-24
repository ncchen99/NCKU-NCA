import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { getAllPosts, createPost } from "@/lib/firestore";

export async function GET(request: NextRequest) {
  const session = await verifyAdmin();
  if (!session) return unauthorizedResponse();

  try {
    const { searchParams } = request.nextUrl;
    const status = searchParams.get("status") ?? undefined;
    const category = searchParams.get("category") ?? undefined;

    const result = await getAllPosts({ status, category });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "取得文章失敗" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await verifyAdmin();
  if (!session) return unauthorizedResponse();

  try {
    const body = await request.json();
    const { title, slug, category, content_markdown, tags, status, cover_image_url } = body;

    const id = await createPost({
      title,
      slug,
      category,
      content_markdown,
      tags: tags ?? [],
      status: status ?? "draft",
      cover_image_url: cover_image_url ?? null,
      author_uid: session.uid,
    });

    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "建立文章失敗" },
      { status: 500 }
    );
  }
}

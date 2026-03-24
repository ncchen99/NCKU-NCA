import { NextRequest } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { getAllSiteContent, updateSiteContent } from "@/lib/firestore";

export async function GET() {
  const admin = await verifyAdmin();
  if (!admin) return unauthorizedResponse();

  try {
    const content = await getAllSiteContent();
    return Response.json({ content });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "取得網站內容失敗" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const admin = await verifyAdmin();
  if (!admin) return unauthorizedResponse();

  try {
    const { pageId, title, content_markdown, metadata } = await req.json();

    if (!pageId) {
      return Response.json(
        { error: "請提供 pageId" },
        { status: 400 }
      );
    }

    const data: { title?: string; content_markdown?: string; metadata?: Record<string, unknown> } = {};
    if (title !== undefined) data.title = title;
    if (content_markdown !== undefined) data.content_markdown = content_markdown;
    if (metadata !== undefined) data.metadata = metadata;

    await updateSiteContent(pageId, data, admin.uid);
    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "更新網站內容失敗" },
      { status: 500 }
    );
  }
}

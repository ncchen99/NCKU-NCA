import { NextRequest } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { importClubs } from "@/lib/firestore";

type ImportFormat = "yaml" | "json";

interface ImportClubInput {
  id?: unknown;
  name?: unknown;
  name_en?: unknown;
  category?: unknown;
  category_code?: unknown;
  status?: unknown;
  email?: unknown;
  description?: unknown;
  website_url?: unknown;
  is_active?: unknown;
  [key: string]: unknown;
}

function toOptionalString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function normalizeClub(club: ImportClubInput, format: ImportFormat) {
  const id = toOptionalString(club.id);
  const name = toOptionalString(club.name);
  const category = toOptionalString(club.category);
  const categoryCode = toOptionalString(club.category_code);

  if (!id || !name || !category || !categoryCode) {
    throw new Error("每筆社團資料需包含 id、name、category、category_code");
  }

  const activeFromStatus =
    typeof club.status === "string" ? club.status === "正式" : undefined;
  const isActive =
    typeof club.is_active === "boolean"
      ? club.is_active
      : activeFromStatus ?? true;
  const importSource: "yaml_import" | "json_import" =
    format === "yaml" ? "yaml_import" : "json_import";

  return {
    id,
    name,
    ...(toOptionalString(club.name_en)
      ? { name_en: toOptionalString(club.name_en) }
      : {}),
    category,
    category_code: categoryCode,
    ...(toOptionalString(club.status) ? { status: toOptionalString(club.status) } : {}),
    ...(toOptionalString(club.email) ? { email: toOptionalString(club.email) } : {}),
    ...(toOptionalString(club.description)
      ? { description: toOptionalString(club.description) }
      : {}),
    ...(toOptionalString(club.website_url)
      ? { website_url: toOptionalString(club.website_url) }
      : {}),
    is_active: isActive,
    import_source: importSource,
    raw_data: club,
  };
}

export async function POST(req: NextRequest) {
  const admin = await verifyAdmin();
  if (!admin) return unauthorizedResponse();

  try {
    const body = await req.json();
    const { clubs, format = "json" } = body as {
      clubs?: ImportClubInput[];
      format?: ImportFormat;
    };

    if (format !== "yaml" && format !== "json") {
      return Response.json({ error: "format 僅支援 yaml 或 json" }, { status: 400 });
    }

    if (!Array.isArray(clubs) || clubs.length === 0) {
      return Response.json(
        { error: "請提供有效的社團資料陣列" },
        { status: 400 }
      );
    }

    const normalized = clubs.map((club) => normalizeClub(club, format));
    const result = await importClubs(normalized);
    return Response.json(result);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "匯入社團失敗" },
      { status: 500 }
    );
  }
}

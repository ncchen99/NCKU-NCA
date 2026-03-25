import { NextRequest } from "next/server";
import yaml from "js-yaml";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { getAllClubs } from "@/lib/firestore";

type ExportFormat = "yaml" | "json";

export async function GET(req: NextRequest) {
  const admin = await verifyAdmin();
  if (!admin) return unauthorizedResponse();

  try {
    const formatParam = req.nextUrl.searchParams.get("format");
    const format: ExportFormat = formatParam === "json" ? "json" : "yaml";

    const clubs = await getAllClubs();
    const exportClubs = clubs.map((club) => ({
      id: club.id,
      name: club.name,
      ...(club.name_en ? { name_en: club.name_en } : {}),
      category: club.category,
      category_code: club.category_code,
      ...(club.status ? { status: club.status } : {}),
      ...(club.email ? { email: club.email } : {}),
      ...(club.description ? { description: club.description } : {}),
      ...(club.website_url ? { website_url: club.website_url } : {}),
      is_active: club.is_active,
      import_source: club.import_source,
      ...(club.raw_data ? { raw_data: club.raw_data } : {}),
    }));

    const payload = {
      meta: {
        exported_at: new Date().toISOString(),
        total_clubs: exportClubs.length,
        source: "ncku-nca-admin",
      },
      clubs: exportClubs,
    };

    const bodyText =
      format === "json"
        ? `${JSON.stringify(payload, null, 2)}\n`
        : yaml.dump(payload, {
            noRefs: true,
            lineWidth: 120,
            quotingType: '"',
            forceQuotes: false,
          });

    const extension = format === "json" ? "json" : "yaml";
    const contentType =
      format === "json"
        ? "application/json; charset=utf-8"
        : "text/yaml; charset=utf-8";

    return new Response(bodyText, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename=clubs_export.${extension}`,
      },
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "匯出社團資料失敗" },
      { status: 500 },
    );
  }
}

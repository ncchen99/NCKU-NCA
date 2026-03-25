import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { getAdminStorage } from "@/lib/firebase-admin";

const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024;

function buildFirebasePublicUrl(bucketName: string, objectPath: string): string {
    const encodedPath = encodeURIComponent(objectPath);
    return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodedPath}?alt=media`;
}

function sanitizeName(name: string): string {
    return name
        .toLowerCase()
        .replace(/\.[^/.]+$/, "")
        .replace(/[^a-z0-9-_]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 48);
}

export async function POST(request: NextRequest) {
    const admin = await verifyAdmin();
    if (!admin) return unauthorizedResponse();

    try {
        const formData = await request.formData();
        const file = formData.get("file");

        if (!(file instanceof File)) {
            return NextResponse.json({ error: "請提供圖片檔案" }, { status: 400 });
        }

        if (!file.type.startsWith("image/")) {
            return NextResponse.json({ error: "僅支援圖片檔案" }, { status: 400 });
        }

        if (file.size > MAX_IMAGE_SIZE_BYTES) {
            return NextResponse.json(
                { error: "圖片大小不可超過 8MB" },
                { status: 400 },
            );
        }

        const inputBuffer = Buffer.from(await file.arrayBuffer());
        const webpBuffer = await sharp(inputBuffer)
            .rotate()
            .resize({ width: 1920, withoutEnlargement: true })
            .webp({ quality: 82, effort: 4 })
            .toBuffer();

        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, "0");
        const safeName = sanitizeName(file.name || "image");
        const fileName = `${Date.now()}-${safeName || "image"}.webp`;
        const objectPath = `posts/${yyyy}/${mm}/${fileName}`;

        const bucket = getAdminStorage().bucket();
        const storageFile = bucket.file(objectPath);

        await storageFile.save(webpBuffer, {
            metadata: {
                contentType: "image/webp",
                cacheControl: "public, max-age=31536000, immutable",
            },
            resumable: false,
            validation: "crc32c",
        });

        const bucketName = bucket.name;
        const url = buildFirebasePublicUrl(bucketName, objectPath);

        return NextResponse.json({
            url,
            path: objectPath,
            contentType: "image/webp",
            size: webpBuffer.length,
        });
    } catch (error) {
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : "圖片上傳失敗",
            },
            { status: 500 },
        );
    }
}

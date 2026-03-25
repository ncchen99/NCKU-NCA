export type AdminImageUploadResult = {
  url: string;
  path?: string;
  contentType?: string;
  size?: number;
};

// Keep this below platform request-body limits to avoid upstream 413 responses.
const MAX_CLIENT_UPLOAD_SIZE_BYTES = 4 * 1024 * 1024;

type AdminImageUploadResponse = {
  url?: string;
  path?: string;
  contentType?: string;
  size?: number;
  error?: string;
};

export async function uploadAdminImage(file: File): Promise<AdminImageUploadResult> {
  if (!file.type.startsWith("image/")) {
    throw new Error("僅支援圖片檔案");
  }

  if (file.size > MAX_CLIENT_UPLOAD_SIZE_BYTES) {
    throw new Error("圖片檔案過大，請壓縮至 4MB 以下再上傳");
  }

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/admin/uploads/image", {
    method: "POST",
    body: formData,
  });

  const contentType = res.headers.get("content-type") ?? "";
  let data: AdminImageUploadResponse = {};

  if (contentType.includes("application/json")) {
    data = (await res.json()) as AdminImageUploadResponse;
  } else if (!res.ok) {
    const rawText = await res.text();
    if (res.status === 413) {
      throw new Error("圖片檔案過大，請壓縮至 4MB 以下再上傳");
    }
    throw new Error(rawText || "圖片上傳失敗");
  }

  if (!res.ok || !data.url) {
    throw new Error(data.error || "圖片上傳失敗");
  }

  return {
    url: data.url,
    path: data.path,
    contentType: data.contentType,
    size: data.size,
  };
}
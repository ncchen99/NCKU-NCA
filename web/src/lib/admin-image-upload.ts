export type AdminImageUploadResult = {
  url: string;
  path?: string;
  contentType?: string;
  size?: number;
};

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

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/admin/uploads/image", {
    method: "POST",
    body: formData,
  });

  const data = (await res.json()) as AdminImageUploadResponse;

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
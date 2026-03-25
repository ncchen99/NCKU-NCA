import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

type UploadPublicObjectInput = {
  key: string;
  body: Buffer;
  contentType: string;
  cacheControl?: string;
};

let _client: S3Client | undefined;

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

function getR2Client(): S3Client {
  if (_client) return _client;

  const accountId = getRequiredEnv("CLOUDFLARE_R2_ACCOUNT_ID");
  const accessKeyId = getRequiredEnv("CLOUDFLARE_R2_ACCESS_KEY_ID");
  const secretAccessKey = getRequiredEnv("CLOUDFLARE_R2_SECRET_ACCESS_KEY");

  _client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    forcePathStyle: true,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  return _client;
}

function toPublicObjectUrl(key: string): string {
  const baseUrl = getRequiredEnv("CLOUDFLARE_R2_PUBLIC_BASE_URL").replace(/\/+$/, "");
  const encodedPath = key
    .split("/")
    .filter(Boolean)
    .map((part) => encodeURIComponent(part))
    .join("/");

  return `${baseUrl}/${encodedPath}`;
}

export async function uploadPublicObjectToR2(input: UploadPublicObjectInput): Promise<string> {
  const bucket = getRequiredEnv("CLOUDFLARE_R2_BUCKET");
  const client = getR2Client();

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: input.key,
      Body: input.body,
      ContentType: input.contentType,
      CacheControl: input.cacheControl,
    }),
  );

  return toPublicObjectUrl(input.key);
}
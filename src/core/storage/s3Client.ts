// src/core/storage/s3Client.ts
import { S3Client } from "@aws-sdk/client-s3";
import config from "../../config/config";

export const s3Client = new S3Client({
  region: "auto",
  endpoint: config.cloudflareR2Endpoint, // Esempio: https://<account_id>.r2.cloudflarestorage.com
  credentials: {
    accessKeyId: config.cloudflareAccessKeyId!,
    secretAccessKey: config.cloudflareSecretAccessKey!,
  },
});
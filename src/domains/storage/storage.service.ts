import { 
  S3Client, 
  PutObjectCommand, 
  GetObjectCommand, 
  DeleteObjectCommand 
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import config from "../../config/config";
import { AppError } from "../../errors/AppError";

export class StorageService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor() {
    this.s3Client = new S3Client({
      region: "auto",
      endpoint: config.cloudflareR2Endpoint, 
      credentials: {
        accessKeyId: config.cloudflareAccessKeyId,
        secretAccessKey: config.cloudflareSecretAccessKey,
      },
    });
    this.bucketName = config.cloudflareBucketName;
  }

  /**
   * Upload diretto di un file su R2 dal Backend.
   */
  async uploadFile(storageKey: string, fileBuffer: Buffer, contentType: string): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: storageKey,
      Body: fileBuffer,
      ContentType: contentType
    });

    try {
      await this.s3Client.send(command);
    } catch (error) {
      console.error("R2 Upload Error:", error);
      throw new AppError("Failed to upload file to storage", 500);
    }
  }

  /**
   * Genera l'URL temporaneo per la lettura (GET).
   */
  async generateDownloadUrl(storageKey: string, expiresIn: number = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: storageKey,
    });

    try {
      return await getSignedUrl(this.s3Client, command, { expiresIn });
    } catch (error) {
      throw new AppError("Failed to generate download signature", 500);
    }
  }

  /**
   * Elimina un file da R2.
   */
  async deleteFile(storageKey: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: storageKey,
    });

    try {
      await this.s3Client.send(command);
    } catch (error) {
      console.error(`Failed to delete file from R2: ${storageKey}`, error);
    }
  }
}

export const storageService = new StorageService();
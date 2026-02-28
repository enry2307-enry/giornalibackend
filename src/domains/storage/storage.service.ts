import { 
  S3Client, 
  PutObjectCommand, 
  GetObjectCommand, 
  DeleteObjectCommand 
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from 'uuid';
import config from "../../config/config";
import { AppError, InternalServerError } from "../../errors/AppError";
import { s3Client } from "../../core/storage/s3Client";

export const storageService = {
  /**
   * Genera una chiave univoca per lo storage e un URL firmato per l'upload (PUT).
   * Il frontend userà questo URL per inviare i byte direttamente a R2.
   */
  async generateUploadUrl(userId: string, contentType: string, originalName: string) {
    const fileExtension = originalName.split('.').pop() || 'bin';
    const fileName = `${uuidv4()}.${fileExtension}`;
    
    // Organizzazione gerarchica: uploads/ID_UTENTE/UUID.ext
    const storageKey = `uploads/${userId}/${fileName}`;

    const command = new PutObjectCommand({
      Bucket: config.cloudflareBucketName,
      Key: storageKey,
      ContentType: contentType,
    });

    try {
      // L'URL scade in 5 minuti (300 secondi)
      const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });
      
      return {
        uploadUrl,
        storageKey,
        fileName
      };
    } catch (error) {
      throw new InternalServerError("Failed to generate upload signature");
    }
  },

  /**
   * Genera un URL firmato per la visualizzazione (GET).
   * Da usare quando il frontend deve mostrare un'immagine o un video.
   */
  async generateDownloadUrl(storageKey: string, expiresIn: number = 3600) {
    const command = new GetObjectCommand({
      Bucket: config.cloudflareBucketName,
      Key: storageKey,
    });

    try {
      // Di default l'URL scade dopo 1 ora
      return await getSignedUrl(s3Client, command, { expiresIn });
    } catch (error) {
      throw new AppError("Failed to generate download signature", 500);
    }
  },

  /**
   * Elimina fisicamente il file da R2.
   * Da chiamare quando un post viene eliminato definitivamente o un media rimosso.
   */
  async deleteFile(storageKey: string) {
    const command = new DeleteObjectCommand({
      Bucket: config.cloudflareBucketName,
      Key: storageKey,
    });

    try {
      await s3Client.send(command);
    } catch (error) {
      // Logghiamo l'errore ma non necessariamente blocchiamo l'esecuzione
      console.error(`Failed to delete file from R2: ${storageKey}`, error);
    }
  }
};
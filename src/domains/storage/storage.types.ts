// src/domains/storage/storage.types.ts
import { BaseAbstractEntity } from "../../types/baseEntity";

/**
 * Enum per i tipi di media supportati.
 * Deve essere sincronizzato con il tipo 'MediaType' nel DB PostgreSQL.
 */
export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  PDF = 'pdf',
  DOCUMENT = 'document'
}

/**
 * Interfaccia principale per l'entità Media.
 * Estende BaseAbstractEntity per includere id, created_at, updated_at e is_deleted.
 */
export interface Media extends BaseAbstractEntity {
  publisher_id: string;
  storage_key: string;  // Il path univoco su Cloudflare R2
  file_name: string;    // Nome originale del file
  mime_type: string;    // Es: 'image/jpeg'
  file_size: number;    // Dimensione in byte
  type: MediaType;      // Categoria del media
  metadata?: Record<string, any>; // JSONB per dati extra (es: width, height, duration)
}

export type MediaInsert = Omit<Media, 'id' | 'created_at' | 'updated_at' | 'is_deleted'>;

/**
 * Tipo per la risposta del servizio di firma (Handshake R2).
 */
export interface UploadSignatureResponse {
  uploadUrl: string;    // URL firmato per la PUT
  storageKey: string;   // Chiave generata dal backend
  fileName: string;     // Nome file generato (UUID)
  mediaId: string;      // ID del record creato nel DB (opzionale se creato in questa fase)
}

export interface MediaReadResponse {
  id: string;
  url: string; // URL firmato temporaneo
  file_name: string;
  type: MediaType;
  metadata?: Record<string, any>;
}
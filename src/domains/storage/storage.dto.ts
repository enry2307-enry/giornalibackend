import { MediaType } from "express";

/**
 * DTO per la creazione di un nuovo record Media nel database.
 * Viene usato dal MediaRepository.
 */
export interface CreateMediaDTO {
  publisher_id: string;
  storage_key: string;
  file_name: string;
  mime_type: string;
  file_size: number;
  type: MediaType;
  metadata?: Record<string, any>;
}
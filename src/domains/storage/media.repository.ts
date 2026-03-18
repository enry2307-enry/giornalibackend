// src/domains/storage/media.repository.ts
import { BaseRepository } from "../../core/database/baseRepository";
import { Media, MediaInsert } from "./storage.types";

export class MediaRepository extends BaseRepository<
  Media,
  MediaInsert
> {
  protected tableName: string = 'media';
}

export const mediaRepository = new MediaRepository();
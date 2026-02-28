// src/domains/storage/media.repository.ts
import { BaseRepository } from "../../core/database/baseRepository";
import { Media, MediaInsert } from "./storage.types";

export class MediaRepository extends BaseRepository<
  Media,
  MediaInsert
> {
  protected tableName: string = 'media';

  async findByPublisher(publisherId: string): Promise<Media[]> {
    return this.findWhere({ publisher_id: publisherId, is_deleted: false });
  }

  async findByStorageKey(key: string): Promise<Media | null> {
    return this.findOneWhere({ storage_key: key });
  }
}

export const mediaRepository = new MediaRepository();
import { BaseRepository } from "../../../core/database/baseRepository";

// types
import { SavePost, SavePostInsert, SavePostUpdate, SaveScrollVideo } from "./bookmark.types";
import { SaveScrollVideoInsert, SaveScrollVideoUpdate } from "./bookmark.types";

/**
 * Sia "SavePost" che "SaveScollVideo" hanno comportamenti analoghi.
 * Quindi le esportiamo insieme
 */

class SavePostRepository extends BaseRepository<
  SavePost, 
  SavePostInsert, 
  SavePostUpdate
> {
  protected tableName: string = 'savepost';
}

class SaveScrollVideoRepository extends BaseRepository<
  SaveScrollVideo,
  SaveScrollVideoInsert,
  SaveScrollVideoUpdate
> {
  protected tableName: string = 'savescrollvideo';
}

export const savePostRepository = new SavePostRepository();
export const saveScrollVideoRepository = new SaveScrollVideoRepository();
import { BaseRepository } from "../../../core/database/baseRepository";
import { DuplicateError, NotFoundError } from "../../../errors/AppError";
import { EntityNotFoundError } from "../../../types/repository";
import { SavePostCreateDTO, SavePostToggleDTO, SaveScrollVideoCreateDTO, SaveScrollVideoToggleDTO } from "./bookmark.dto";
import { savePostRepository, saveScrollVideoRepository } from "./bookmark.repository";
import { BaseAbstractContentSave, SavePost, SavePostInsert, SavePostUpdate, SaveScrollVideo, SaveScrollVideoInsert, SaveScrollVideoUpdate } from "./bookmark.types";

/**
 * Visto che le tabelle "SavePost" e "SaveScrollVideo" funzionano
 * in modo analogo, usiamo un solo service per risparmiare codice
 */
abstract class BaseBookmarkService <
  T extends BaseAbstractContentSave,
  TInsert extends Partial<T>,
  TUpdate extends Partial<T>,
  TToggleDTO extends SavePostToggleDTO | SaveScrollVideoToggleDTO,
  R extends BaseRepository<T, TInsert, TUpdate>
>{

  protected repository: R;

  constructor(repository: R) {
    this.repository = repository;
  }

  async toggleBookmark(
    userId: string,
    entityId: string,
    dto: TToggleDTO
  ) {
    const bookmark = await this.repository.findOneWhere({
      user_id: userId,
      entity_id: entityId
    });

    /**
     * Qui facciamo sostanzialmente un Upsert
     */

    let performedUpsert: boolean;

    if(!bookmark) {
      const dataToInsert = {
        user_id: userId,
        entity_id: entityId,
        notify_user: dto?.notify_user,
      } as TInsert;

      return {
        data: await this.repository.create(dataToInsert),
        performedUpsert: true
      };
    }

    const dataToUpdate = {
      notify_user: dto?.notify_user,
      is_active: !bookmark.is_active  // toggle
    } as TUpdate;

    return {
      data: await this.repository.update(bookmark.id, dataToUpdate),
      performedUpsert: false
    };
    
  }

  async toggleNotification(userId: string, entityId: string) {
    const bookmark = await this.repository.findOneWhere({
      user_id: userId,
      entity_id: entityId
    });

    if(!bookmark) {
      throw new NotFoundError('Post or ScrollVideo not found');
    }

    const dataToUpdate = {
      notify_user: !bookmark.notify_user // toggle
    } as TUpdate;
    
    return await this.repository.update(bookmark.id, dataToUpdate);
  }
}

class SavePostService extends BaseBookmarkService<
  SavePost,
  SavePostInsert,
  SavePostUpdate,
  SavePostToggleDTO,
  typeof savePostRepository
> {}
export const savePostService = new SavePostService(savePostRepository);

class SaveScrollVideoService extends BaseBookmarkService<
  SaveScrollVideo,
  SaveScrollVideoInsert,
  SaveScrollVideoUpdate,
  SaveScrollVideoToggleDTO,
  typeof saveScrollVideoRepository
> {}
export const saveScrollVideoService = new SaveScrollVideoService(saveScrollVideoRepository);
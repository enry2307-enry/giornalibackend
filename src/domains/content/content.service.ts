// src/domains/content/base-content.service.ts
import { v4 as uuidv4 } from "uuid";
import { mediaRepository } from "../storage/media.repository";
import { storageService } from "../storage/storage.service";
import { StorageUploadError } from "../storage/storage.errors";
import { MediaType } from "../storage/storage.types";
import { BaseRepository } from "../../core/database/baseRepository";
import { authRepository } from "../auth/auth.repository";
import { Post } from "./post/post.types";
import { ScrollVideo } from "./scroll-video/scroll-video.types";
import { publisherRepository } from "../profiles/publisher/publisher.repository";
import { ForbiddenError, InternalServerError, ValidationError } from "../../errors/AppError";

// Interfaccia per i repository che supportano il linking dei media
interface LinkableRepository<
  T extends { id: string }, 
  TInsert extends Partial<T>, 
  TUpdate extends Partial<T>
> extends BaseRepository<T, TInsert, TUpdate> {
  linkMedia(contentId: string, mediaId: string, position: number): Promise<void>;
}

export abstract class BaseContentService<
  T extends Post | ScrollVideo, 
  TInsert extends Partial<T>, 
  TUpdate extends Partial<T>
> {
  protected abstract repository: LinkableRepository<T, TInsert, TUpdate>;
  protected abstract storagePrefix: string;

  /**
   * Controlla se userId è il proprietario del contenuto
   * @param userId 
   * @param contentId 
   * @raises Validation Error se l'user non è un publisher
   * @raises ForbiddenError se l'user ( e quindi il publisher ) non è il proprietario del post
   * @returns Il contenuto
   */
  protected async ensureOwnershipOfContent(userId: string, contentId: string): Promise<T>{
    // "mossa" difensiva per evitare contenere inconsistenza di dati ( da errore se non lo trova )
    await authRepository.findById(userId);

    const publisher = await publisherRepository.findOneWhere({user_id: userId});
    if(!publisher) throw new ValidationError('You are not a publisher.');

    const content = await this.repository.findById(contentId);

    if(content.publisher_id !== publisher.id) throw new ForbiddenError("You cannot delete a post you are not the author of.");

    return content;
  }

  async create(dto: TInsert & { publisher_id: string }, files?: Express.Multer.File[]): Promise<{ content: T }> {
    const uploadedMedia: any[] = [];

    if (files && files.length > 0) {
      try {
        for (const file of files) {
          const storageKey = `${this.storagePrefix}/${dto.publisher_id}/${uuidv4()}-${file.originalname}`;
          
          await storageService.uploadFile(storageKey, file.buffer, file.mimetype);

          const media = await mediaRepository.create({
            publisher_id: dto.publisher_id,
            storage_key: storageKey,
            file_name: file.originalname,
            mime_type: file.mimetype,
            file_size: file.size,
            type: file.mimetype.startsWith('image/') ? MediaType.IMAGE : MediaType.VIDEO,
          });

          uploadedMedia.push(media);
        }
      } catch (error) {
        // ROLLBACK: Pulizia R2 e DB
        for (const m of uploadedMedia) {
          await storageService.deleteFile(m.storage_key);
          await mediaRepository.hardDelete(m.id);
        }
        throw new StorageUploadError('Upload failed, storage cleaned up');
      }
    }

    // Creazione del contenuto (Post o ScrollVideo)
    const content = await this.repository.create(dto);

    // Linking dei media
    if (uploadedMedia.length > 0) {
      await Promise.all(
        uploadedMedia.map((media, index) => 
          this.repository.linkMedia(content.id, media.id, index)
        )
      );
    }

    return { content };
  }

  async update(userId: string, id: string, dto: TUpdate): Promise<T> {
    this.ensureOwnershipOfContent(userId, id);
    return await this.repository.update(id, dto);
  }

  async getById(id: string): Promise<T> {
    return await this.repository.findById(id);
  }

  async delete(userId: string, id: string): Promise<void> {
    this.ensureOwnershipOfContent(userId, id);
    await this.repository.softDelete(id);
  }
}
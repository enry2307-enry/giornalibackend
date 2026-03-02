// src/domains/content/post/post.service.ts
import { postRepository } from "./post.repository";
import { mediaRepository } from "../../storage/media.repository";
import { storageService } from "../../storage/storage.service";
import { CreatePostDTO, UpdatePostDTO } from "./post.dto";
import { ContentStatus } from "./post.types";
import { MediaType } from "../../storage/storage.types";
import { AppError } from "../../../errors/AppError";
import { v4 as uuidv4 } from "uuid";

export class PostService {
  /**
   * Crea un post e gestisce l'upload dei media.
   * In caso di errore su un singolo file, il post viene salvato come DRAFT.
   */
  async createPost(dto: CreatePostDTO, files?: Express.Multer.File[]) {
    let hasUploadErrors = false;

    const post = await postRepository.create({
      publisher_id: dto.publisher_id,
      category_id: dto.category_id,
      status: dto.status,
      ...(dto.description && { description: dto.description }),
    });

    if (files && files.length > 0) {
      for (const [index, file] of files.entries()) {
        try {
          const storageKey = `posts/${dto.publisher_id}/${uuidv4()}-${file.originalname}`;
          await storageService.uploadFile(storageKey, file.buffer, file.mimetype);
          
          const media = await mediaRepository.create({
            publisher_id: dto.publisher_id,
            storage_key: storageKey,
            file_name: file.originalname,
            mime_type: file.mimetype,
            file_size: file.size,
            type: file.mimetype.startsWith('image/') ? MediaType.IMAGE : MediaType.VIDEO,
          });

          await postRepository.linkMedia(post.id, media.id, index);
        } catch (error) {
          hasUploadErrors = true;
        }
      }
    }

    // Se ci sono stati errori, il post diventa DRAFT
    let finalPost = post;
    if (hasUploadErrors && post.status === ContentStatus.ACTIVE) {
      finalPost = await postRepository.update(post.id, { status: ContentStatus.DRAFT });
    }

    return { post: finalPost, hasUploadErrors };
  }

  /**
   * Aggiorna i metadati del post
   */
  async updatePost(id: string, dto: UpdatePostDTO) {
    return await postRepository.update(id, dto);
  }

  /**
   * Esegue il soft delete del post
   */
  async deletePost(id: string) {
    return await postRepository.softDelete(id);
  }
}

export const postService = new PostService();
/**
 * Visto che abbiamo due tabelle praticamente uguali,
 * ciò che cambia è SOLO la repo.
 * Sviluppiamo un codice in base a questo
 */

import { BaseRepository } from "../../../core/database/baseRepository";
import { ForbiddenError } from "../../../errors/AppError";
import { authRepository } from "../../auth/auth.repository";
import { CommentCreateDTO, CommentEditDTO} from "./comment.dto";
import { CommentNotFound, InvalidEdit } from "./comment.errors";
import { Comment, CommentInsert, CommentUpdate, CommentStatus } from "./comment.types";

class BaseCommentService<T extends BaseRepository<Comment, CommentInsert, CommentUpdate>> {
  
  protected repository: T;
  
  constructor(repository: T) {
    this.repository = repository;
  }

  async create(userId: string, dto: CommentCreateDTO): Promise<Comment> {
    // Difesa contro dati inconsistenti
    // Lancia 404 se user non è trovato
    await authRepository.findById(userId);

    return await this.repository.create({
      user_id: userId,
      ...dto
    });
  }

  async update(userId: string, dto: CommentEditDTO): Promise<Comment> {
    // Difesa contro dati inconsistenti
    // Lancia 404 se user non è trovato
    await authRepository.findById(userId);

    const comment = await this.repository.findOneWhere({user_id: userId});
    if(!comment) throw new CommentNotFound();
    
    // Controlla se effettivamente c'è un update
    if(comment.content === dto.content) 
      throw new InvalidEdit();

    const dataToUpdate = {
      content: dto.content,
      ...(comment.status === CommentStatus.NORMAL && { status: CommentStatus.EDITED })
    }
    
    return await this.repository.update(comment.id, dataToUpdate);
  }

  async getReplies(
    // se il parametro "options" verrà utilizzato anche in altri service
    // lo convertirò in un'interface per evitare di ripetere il codice
    parentId: string,
    options?: {
      limit?: number;               // massimo numero di reply da restituire (default 10)
      cursor?: string;              // valore del campo ordinato per continuare la paginazione
      orderBy?: { column: string; ascending?: boolean }; // ordinamento custom
      includeDeleted?: boolean;     // se includere commenti soft-deleted
    }
  ) {
    const queryOptions = {
      limit: options?.limit ?? 10,
      cursor: options?.cursor,
      orderBy: options?.orderBy ?? { column: 'created_at', ascending: true },
      includeDeleted: options?.includeDeleted ?? false
    };


    // vedi comment.repository.ts
    const result = await this.repository.SERVE_QUI({ parent_id: parentId }, queryOptions);

    return result;
  }

  async delete(userId: string, id: string) {
    const user = await authRepository.findById(userId);
    const comment = await this.repository.findById(id);

    if(user.id !== comment.user_id)
      throw new ForbiddenError('You are not the author of this comment.');

    await this.repository.softDelete(id);
  } 
}
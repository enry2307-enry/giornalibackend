/**
 * Questo service coopera le due tabelle "CommentOnPost" e "CommentOnScrollVideo".
 * Le due tabelle hanno esattamente gli stessi campi. ( cambia una FK ), ma i nomi sono uguali.
 * 
 * C'è anche una View "CommentUnified" che unifica le due tabelle. Il risultato
 * è sostanzialmente "polimorfismo".
 * 
 * Questo service gestisce esattamente questo polimorfismo.
 * Abbiamo sia il vantaggio di avere polimorfismo, ma anche di avere le strong
 * foreign key di PostGres ( visto che effettivamente sono due tabelle distinte ).
 */
import { BaseRepository, QueryResult } from "../../../core/database/baseRepository";
import { ForbiddenError } from "../../../errors/AppError";
import { authRepository } from "../../auth/auth.repository";
import { CommentCreateDTO, CommentEditDTO} from "./comment.dto";
import { CommentNotFound, InvalidEdit } from "./comment.errors";
import { commentOnPostRepository, commentOnScrollVideoRepository, GenericCommentRepository } from "./comment.repository";
import { Comment, CommentInsert, CommentUpdate, CommentStatus, PublicComment } from "./comment.types";

class BaseCommentService {
  
  protected repository: GenericCommentRepository;
  
  constructor(repository: GenericCommentRepository) {
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

    const { comment_id } = dto;

    // con questa query verifichiamo sia l'esistenza del commento che l'appartenenza all'user.
    const comment = await this.repository.findOneWhere({ id: comment_id, user_id: userId});
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
    parentId: string,
    options?: {
      cursor?: string | undefined;              // valore del campo ordinato per continuare la paginazione
    }
  ): Promise<QueryResult<PublicComment[]>> {

    // per il momento preferisco non fare parametrici dinamici col GET.
    // finché non ho una buona validazione e sanitizzazione di req.params, è meglio che non mi incastro in queste cose
    // generalmente prendere 10 commenti alla volta non dovrebbe essere negativos
    const queryOptions = {
      limit: 10,
      cursor: options?.cursor,
      orderBy: { column: 'created_at', ascending: true },
    };

    return await this.repository.getRepliesWithAuthor({entityType: 'comment', entityId: parentId}, queryOptions);
  }

  async delete(userId: string, id: string) {
    const user = await authRepository.findById(userId);
    const comment = await this.repository.findById(id);

    if(user.id !== comment.user_id)
      throw new ForbiddenError('You are not the author of this comment.');

    await this.repository.softDelete(id);
  } 
}

export const commentOnPostService = new BaseCommentService(commentOnPostRepository);
export const commentOnScrollVideoService = new BaseCommentService(commentOnScrollVideoRepository);
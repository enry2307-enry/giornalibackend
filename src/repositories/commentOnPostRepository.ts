// repositories/commentOnPostRepository.ts
import { CommentOnPost } from '../types/models';
import { BaseRepository } from './baseRepository';

export class CommentOnPostRepository extends BaseRepository<CommentOnPost> {
  protected tableName = 'commentonpost';
  protected defaultSelect = 'id,created_at';
}
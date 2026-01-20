// repositories/commentOnPostRepository.ts
import { Category, CommentOnPost } from '../types/models';
import { BaseRepository } from './baseRepository';

export class CommentOnPostRepository extends BaseRepository<CommentOnPost, CommentOnPost> {
  protected tableName = 'commentonpost';
  protected defaultSelect = 'id,created_at';
}
// repositories/likeOnPostRepository.ts
import { LikeOnPost } from '../types/models';
import { BaseRepository } from './baseRepository';

export class LikeOnPostRepository extends BaseRepository<LikeOnPost, LikeOnPost> {
  protected tableName = 'likeonpost';
  protected defaultSelect = 'id,created_at';
}
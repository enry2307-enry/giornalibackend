// repositories/likeOnPostRepository.ts
import { LikeOnPost } from '../types/models';
import { BaseRepository } from './baseRepository';

export class LikeOnPostRepository extends BaseRepository<LikeOnPost> {
  protected tableName = 'likeonpost';
}
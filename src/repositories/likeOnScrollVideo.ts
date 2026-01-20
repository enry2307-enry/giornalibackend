// repositories/likeOnScrollVideoRepository.ts
import { LikeOnScrollVideo } from '../types/models';
import { BaseRepository } from './baseRepository';

export class LikeOnScrollVideoRepository extends BaseRepository<LikeOnScrollVideo, LikeOnScrollVideo> {
  protected tableName = 'likeonscrollvideo';
  protected defaultSelect = 'id,created_at';
}
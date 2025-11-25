// repositories/commentOnScrollVideoRepository.ts
import { CommentOnScrollVideo } from '../types/models';
import { BaseRepository } from './baseRepository';

export class CommentOnScrollVideoRepository extends BaseRepository<CommentOnScrollVideo> {
  protected tableName = 'commentonscrollvideo';
}
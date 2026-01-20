// repositories/scrollVideoRepository.ts
import { ScrollVideo } from '../types/models';
import { BaseRepository } from './baseRepository';

export class ScrollVideoRepository extends BaseRepository<ScrollVideo> {
  protected tableName = 'scrollvideo';
  protected defaultSelect = 'id,created_at';
}
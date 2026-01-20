// repositories/postRepository.ts
import { Post } from '../types/models';
import { BaseRepository } from './baseRepository';

export class PostRepository extends BaseRepository<Post> {
  protected tableName = 'post';
  protected defaultSelect = 'id,created_at';
}
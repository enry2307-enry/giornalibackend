// repositories/followRepository.ts
import { Follow } from '../types/models';
import { BaseRepository } from './baseRepository';

export class FollowRepository extends BaseRepository<Follow, Follow> {
  protected tableName = 'follow';
  protected defaultSelect = 'id,created_at';
}
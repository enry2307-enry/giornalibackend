// repositories/followRepository.ts
import { Follow } from '../types/models';
import { BaseRepository } from './baseRepository';

export class FollowRepository extends BaseRepository<Follow> {
  protected tableName = 'follow';
}
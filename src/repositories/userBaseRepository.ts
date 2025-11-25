// repositories/userBaseRepository.ts
import { UserBase } from '../types/models';
import { BaseRepository } from './baseRepository';

export class UserBaseRepository extends BaseRepository<UserBase> {
  protected tableName = 'userbase';
}
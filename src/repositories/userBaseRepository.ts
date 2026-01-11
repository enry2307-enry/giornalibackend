// repositories/userBaseRepository.ts
import { UserBase } from '../types/models';
import { BaseRepository } from './baseRepository';
import supabase from '../config/supabase';

export class UserBaseRepository extends BaseRepository<UserBase> {
  protected tableName = 'userbase';
  protected defaultSelect = 'id,created_at';
}
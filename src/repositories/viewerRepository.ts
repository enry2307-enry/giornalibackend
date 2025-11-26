// repositories/viewerRepository.ts
import { Viewer } from '../types/models';
import { BaseRepository } from './baseRepository';
import supabase from '../config/supabase';

export class ViewerRepository extends BaseRepository<Viewer> {
  protected tableName = 'viewer';

  async getByUsername(username: string): Promise<Viewer | null>{
    return await this.findByField('username', username);
  }

  async getByUserId(userId: string): Promise<Viewer | null> {
    return await this.findByField('user_id', userId);
  } 
}
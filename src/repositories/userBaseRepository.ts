// repositories/userBaseRepository.ts
import { UserBase } from '../types/models';
import { BaseRepository } from './baseRepository';
import supabase from '../config/supabase';

export class UserBaseRepository extends BaseRepository<UserBase> {
  protected tableName = 'userbase';

  async findByEmail(email: string): Promise<UserBase | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('email', email)
      .eq('is_deleted', false)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null; // No rows found
      throw error;
    }
    
    return data as UserBase;
  }
}
// repositories/userBaseRepository.ts
import { UserBase } from '../types/models';
import { BaseRepository } from './baseRepository';
import supabase from '../config/supabase';

export class UserBaseRepository extends BaseRepository<UserBase> {
  protected tableName = 'userbase';
  protected defaultSelectFields: string = 'id, email, created_at, updated_at, status'; 

  async findByEmail(
    email: string, 
    selectFields?: string[]
  ): Promise<UserBase | null> {
    
    const selectString =
      selectFields && selectFields.length > 0
        ? selectFields.join(',')
        : this.defaultSelectFields;

    const { data, error } = await supabase
      .from(this.tableName)
      .select(selectString)
      .eq('email', email)
      .eq('is_deleted', false)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null; // No rows found
      throw error;
    }

    return data as unknown as UserBase | null;
  }

  // Override create to exclude password from response
  async create(item: Partial<UserBase>): Promise<UserBase> {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(item)
      .select(this.defaultSelectFields)  // Use safe fields
      .single();
    
    if (error) throw error;
    return data as unknown as UserBase;
  }

  // Override update to exclude password from response
  async update(id: string, item: Partial<UserBase>): Promise<UserBase> {
    const { data, error } = await supabase
      .from(this.tableName)
      .update(item)
      .eq('id', id)
      .select(this.defaultSelectFields)  // Use safe fields
      .single();
    
    if (error) throw error;
    return data as unknown as UserBase;
  }
}
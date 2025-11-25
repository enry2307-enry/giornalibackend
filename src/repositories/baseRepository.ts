// repositories/BaseRepository.ts
import supabase from '../config/supabase';

export abstract class BaseRepository<T> {
  protected abstract tableName: string;

  async findAll(): Promise<T[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('is_deleted', false);
    
    if (error) throw error;
    return data as T[];
  }

  async findById(id: string): Promise<T | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .eq('is_deleted', false)
      .single();
    
    if (error) throw error;
    return data as T | null;
  }

  async create(item: Partial<T>): Promise<T> {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(item)
      .select()
      .single();
    
    if (error) throw error;
    return data as T;
  }

  async update(id: string, item: Partial<T>): Promise<T> {
    const { data, error } = await supabase
      .from(this.tableName)
      .update(item)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as T;
  }

  async softDelete(id: string): Promise<void> {
    const { error } = await supabase
      .from(this.tableName)
      .update({ is_deleted: true })
      .eq('id', id);
    
    if (error) throw error;
  }
}
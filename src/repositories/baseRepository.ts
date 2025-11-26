// repositories/BaseRepository.ts
import supabase from '../config/supabase';

export abstract class BaseRepository<T> {
  protected abstract tableName: string;

  async findAll(selectFields: string[] = ['*']): Promise<T[]> {
    const selectString = selectFields.join(',');

    const { data, error } = await supabase
      .from(this.tableName)
      .select(selectString)
      .eq('is_deleted', false);
    
    if (error) throw error;
    return data as T[];
  }

  async findById(id: string, selectFields: string[] = ['*']): Promise<T | null> {
    const selectString = selectFields.join(',');

    const { data, error } = await supabase
      .from(this.tableName)
      .select(selectString)
      .eq('id', id)
      .eq('is_deleted', false)
      .single();
    
    if (error) throw error;
    return data as T | null;
  }

  async findByField(
    field: string, 
    value: string | number | boolean, 
    selectFields: string[] = ['*']
  ): Promise<T | null> {
    const selectString = selectFields.join(',');
    
    const { data, error } = await supabase
      .from(this.tableName)
      .select(selectString)
      .eq(field, value)
      .eq('is_deleted', false)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    
    return data as T;
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
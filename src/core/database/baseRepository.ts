// src/core/database/BaseRepository.ts
import supabase from './supabase';
import { RepositoryError, EntityNotFoundError, FindOptions, QueryOptions } from '../../types/repository';

export interface QueryResult<T> {
  data: T;
  meta: {
    count: number;
  };
}

export abstract class BaseRepository<
  Entity extends { id: string },
  Insert extends Partial<Entity>,
  Update extends Partial<Entity> = Partial<Entity>
>{
  protected abstract tableName: string;
  protected defaultSelect = '*';

  protected getSelectString(options?: FindOptions): string {
    return options?.select?.join(',') || this.defaultSelect;
  }

  protected applyQueryOptions(query: any, options?: QueryOptions) {
    if (!options?.includeDeleted) {
      query = query.eq('is_deleted', false);
    }
    
    if (options?.orderBy) {
      query = query.order(options.orderBy.column, { 
        ascending: options.orderBy.ascending ?? true 
      });
    }

    if (options?.limit !== undefined || options?.offset !== undefined) {
      const limit = options?.limit || 10;
      const offset = options?.offset || 0;
      // Supabase .range(from, to) è inclusivo
      query = query.range(offset, offset + limit - 1);
    }

    return query;
  }

  protected handleError(error: any, context: string): never {
    throw new RepositoryError(`${context} failed: ${error.message}`, error);
  }

  // ===========================
  // READ METHODS (COLLECTIONS)
  // ===========================

  async findAll(options?: FindOptions): Promise<QueryResult<Entity[]>> {
    try {
      let query = supabase
        .from(this.tableName)
        .select(this.getSelectString(options), { count: 'exact' });

      query = this.applyQueryOptions(query, options);

      const { data, error, count } = await query;
      
      if (error) throw error;
      return { 
        data: data as unknown as Entity[], 
        meta: { count: count || 0 } 
      };
    } catch (error) {
      this.handleError(error, 'findAll');
    }
  }

  async findWhere(
    conditions: Record<string, any>,
    options?: FindOptions
  ): Promise<QueryResult<Entity[]>> {
    try {
      let query = supabase
        .from(this.tableName)
        .select(this.getSelectString(options), { count: 'exact' });

      Object.entries(conditions).forEach(([key, value]) => {
        query = query.eq(key, value);
      });

      query = this.applyQueryOptions(query, options);

      const { data, error, count } = await query;
      
      if (error) throw error;
      return {
        data: data as unknown as Entity[],
        meta: { count: count || 0 }
      };
    } catch (error) {
      this.handleError(error, 'findWhere');
    }
  }

  // ===========================
  // READ METHODS (SINGLE)
  // ===========================

  async findById(id: string, options?: FindOptions): Promise<QueryResult<Entity>> {
    try {
      let query = supabase
        .from(this.tableName)
        .select(this.getSelectString(options))
        .eq('id', id);

      query = this.applyQueryOptions(query, options);

      const { data, error } = await query.single();

      if (error) {
        if (error.code === 'PGRST116') throw new EntityNotFoundError(this.tableName, id);
        throw error;
      }

      return {
        data: data as unknown as Entity,
        meta: { count: 1 }
      };
    } catch (error) {
      if (error instanceof EntityNotFoundError) throw error;
      this.handleError(error, 'findById');
    }
  }

  async findOneWhere(
    conditions: Record<string, any>,
    options?: FindOptions
  ): Promise<QueryResult<Entity | null>> {
    try {
      let query = supabase
        .from(this.tableName)
        .select(this.getSelectString(options));

      Object.entries(conditions).forEach(([key, value]) => {
        query = query.eq(key, value);
      });

      query = this.applyQueryOptions(query, options);

      const { data, error } = await query.maybeSingle();
      
      if (error) throw error;
      return {
        data: data as Entity | null,
        meta: { count: data ? 1 : 0 }
      };
    } catch (error) {
      this.handleError(error, 'findOneWhere');
    }
  }

  // ===========================
  // WRITE METHODS
  // ===========================

  async create(item: Insert): Promise<QueryResult<Entity>> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .insert(item)
        .select(this.defaultSelect)
        .single();
      
      if (error) throw error;
      return {
        data: data as unknown as Entity,
        meta: { count: 1 }
      };
    } catch (error) {
      this.handleError(error, 'create');
    }
  }

  async update(id: string, item: Partial<Update>): Promise<QueryResult<Entity>> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .update(item)
        .eq('id', id)
        .eq('is_deleted', false)
        .select(this.defaultSelect)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') throw new EntityNotFoundError(this.tableName, id);
        throw error;
      }
      return {
        data: data as unknown as Entity,
        meta: { count: 1 }
      };
    } catch (error) {
      if (error instanceof EntityNotFoundError) throw error;
      this.handleError(error, 'update');
    }
  }

  // ===========================
  // DELETE METHODS
  // ===========================

  async softDelete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .update({ is_deleted: true } as any)
        .eq('id', id)
        .eq('is_deleted', false);
      
      if (error) throw error;
    } catch (error) {
      this.handleError(error, 'softDelete');
    }
  }

  async hardDelete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      this.handleError(error, 'hardDelete');
    }
  }
}
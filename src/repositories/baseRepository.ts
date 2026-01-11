// repositories/BaseRepository.ts
import supabase from '../config/supabase';
import { RepositoryError, NotFoundError, FindOptions, QueryOptions } from '../types/repositoryTypes';

export abstract class BaseRepository<T extends { id: string }> {
  protected abstract tableName: string;
  protected abstract defaultSelect: string;

  protected getSelectString(options?: FindOptions): string {
    return options?.select?.join(',') || this.defaultSelect;
  }

  protected applyQueryOptions(query: any, options?: QueryOptions) {
    if (!options?.includeDeleted) {
      query = query.eq('is_deleted', false);
    }
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }
    if (options?.orderBy) {
      query = query.order(options.orderBy.column, { ascending: options.orderBy.ascending ?? true });
    }
    return query;
  }

  protected handleError(error: any, context: string): never {
    throw new RepositoryError(`${context} failed: ${error.message}`, error);
  }

  async findAll(options?: FindOptions): Promise<T[]> {
    try {
      let query = supabase
        .from(this.tableName)
        .select(this.getSelectString(options));

      query = this.applyQueryOptions(query, options);

      const { data, error } = await query;
      
      if (error) throw error;
      return data as unknown as T[];
    } catch (error) {
      this.handleError(error, 'findAll');
    }
  }

  async findById(id: string, options?: FindOptions): Promise<T> {
    try {
      let query = supabase
        .from(this.tableName)
        .select(this.getSelectString(options))
        .eq('id', id);

      query = this.applyQueryOptions(query, options);

      const { data, error } = await query.single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new NotFoundError(this.tableName, id);
        }
        throw error;
      }

      return data as unknown as T;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      this.handleError(error, 'findById');
    }
  }

  async findWhere(
    conditions: Record<string, any>,
    options?: FindOptions
  ): Promise<T[]> {
    try {
      let query = supabase
        .from(this.tableName)
        .select(this.getSelectString(options));

      Object.entries(conditions).forEach(([key, value]) => {
        query = query.eq(key, value);
      });

      query = this.applyQueryOptions(query, options);

      const { data, error } = await query;
      
      if (error) throw error;
      return data as unknown as T[];
    } catch (error) {
      this.handleError(error, 'findWhere');
    }
  }

  async findOneWhere(
    conditions: Record<string, any>,
    options?: FindOptions
  ): Promise<T | null> {
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
      return data as T | null;
    } catch (error) {
      this.handleError(error, 'findOneWhere');
    }
  }

  async create(item: Omit<T, 'id'>): Promise<T> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .insert(item)
        .select(this.defaultSelect)
        .single();
      
      if (error) throw error;
      return data as unknown as T;
    } catch (error) {
      this.handleError(error, 'create');
    }
  }

  async update(id: string, item: Partial<Omit<T, 'id'>>): Promise<T> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .update(item)
        .eq('id', id)
        .eq('is_deleted', false)
        .select(this.defaultSelect)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          throw new NotFoundError(this.tableName, id);
        }
        throw error;
      }
      return data as unknown as T;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      this.handleError(error, 'update');
    }
  }

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

// Example implementation
// export interface Viewer {
//   id: string;
//   user_id: string;
//   name: string;
//   email: string;
//   created_at: string;
//   is_deleted: boolean;
// }
// 
// export class ViewerRepository extends BaseRepository<Viewer> {
//   protected tableName = 'viewers';
//   protected defaultSelect = 'id,user_id,name,email,created_at';
// 
//   async findByUserId(userId: string): Promise<Viewer | null> {
//     return this.findOneWhere({ user_id: userId });
//   }
// 
//   async findActiveViewers(): Promise<Viewer[]> {
//     return this.findAll({ 
//       orderBy: { column: 'created_at', ascending: false },
//       limit: 100 
//     });
//   }
// }
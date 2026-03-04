// src/core/database/BaseRepository.ts
import supabase from './supabase';
import { RepositoryError, EntityNotFoundError, FindOptions, QueryOptions } from '../../types/repository';

export interface PaginatedResult<T> {
  data: T[];
  count: number;
}
/**
 * BaseRepository personalizzato scritto interamente da noi.
 * Si trova ancora ad una versione base.
 * Pronto per essere esteso da sotto-repository, ognuno in base
 * alle necessità
 */
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

  /**
   * Applica filtri di soft-delete, ordinamento e paginazione range-based.
   */
  protected applyQueryOptions(query: any, options?: QueryOptions) {
    if (!options?.includeDeleted) {
      query = query.eq('is_deleted', false);
    }
    
    if (options?.orderBy) {
      query = query.order(options.orderBy.column, { 
        ascending: options.orderBy.ascending ?? true 
      });
    }

    // Paginazione: Supabase usa .range(from, to) inclusivi
    if (options?.limit !== undefined || options?.offset !== undefined) {
      const limit = options?.limit || 10;
      const offset = options?.offset || 0;
      query = query.range(offset, offset + limit - 1);
    }

    return query;
  }

  protected handleError(error: any, context: string): never {
    throw new RepositoryError(`${context} failed: ${error.message}`, error);
  }

  /**
   * Recupera tutti i record con supporto a paginazione e count totale.
   */
  async findAll(options?: FindOptions): Promise<PaginatedResult<Entity>> {
    try {
      let query = supabase
        .from(this.tableName)
        .select(this.getSelectString(options), { count: 'exact' });

      query = this.applyQueryOptions(query, options);

      const { data, error, count } = await query;
      
      if (error) throw error;
      return { 
        data: data as unknown as Entity[], 
        count: count || 0 
      };
    } catch (error) {
      this.handleError(error, 'findAll');
    }
  }

  /**
   * Ricerca filtrata per uguaglianza con supporto a paginazione e count totale.
   */
  async findWhere(
    conditions: Record<string, any>,
    options?: FindOptions
  ): Promise<PaginatedResult<Entity>> {
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
        count: count || 0
      };
    } catch (error) {
      this.handleError(error, 'findWhere');
    }
  }

  async findById(id: string, options?: FindOptions): Promise<Entity> {
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

      return data as unknown as Entity;
    } catch (error) {
      if (error instanceof EntityNotFoundError) throw error;
      this.handleError(error, 'findById');
    }
  }

  async findOneWhere(
    conditions: Record<string, any>,
    options?: FindOptions
  ): Promise<Entity | null> {
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
      return data as Entity | null;
    } catch (error) {
      this.handleError(error, 'findOneWhere');
    }
  }

  async create(item: Insert): Promise<Entity> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .insert(item)
        .select(this.defaultSelect)
        .single();
      
      if (error) throw error;
      return data as unknown as Entity;
    } catch (error) {
      this.handleError(error, 'create');
    }
  }

  async update(id: string, item: Partial<Update>): Promise<Entity> {
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
      return data as unknown as Entity;
    } catch (error) {
      if (error instanceof EntityNotFoundError) throw error;
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
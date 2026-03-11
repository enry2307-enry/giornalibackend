// src/core/database/BaseRepository.ts
import supabase from './supabase';
import { RepositoryError, EntityNotFoundError, FindOptions, QueryOptions } from '../types/repository.types';

export interface QueryResult<T> {
  data: T;
  meta: {
    count: number;
    nextCursor?: string;  // id dell'ultimo elemento
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

  /**
   * Applica opzioni di query generiche su una tabella Supabase.
   * 
   * Funzionamento:
   * 1. Filtra i record soft-deleted: se `options.includeDeleted` è false o undefined,
   *    aggiunge `is_deleted = false` alla query.
   * 
   * 2. Imposta l'ordinamento:
   *    - Se `options.orderBy` è presente, ordina per `options.orderBy.column` con
   *      direzione `ascending = options.orderBy.ascending ?? true`.
   *    - Se `options.orderBy` non è passato, ordina di default per `created_at` ascending.
   * 
   * 3. Applica un limite di righe:
   *    - `options.limit` se passato, altrimenti default = 10.
   * 
   * 4. Gestione della paginazione:
   *    - Cursor-based pagination: se `options.cursor` è presente, aggiunge `.gt(orderColumn, options.cursor)`
   *      e applica il `limit`.
   *    - Offset-based pagination: altrimenti usa `options.offset ?? 0` e `.range(offset, offset + limit - 1)`.
   * 
   * Cosa aspettarsi:
   * - La query restituirà sempre al massimo `limit` righe.
   * - Se non viene passato `orderBy`, l'ordinamento sarà deterministico su `created_at`.
   * - Cursor e offset funzionano correttamente solo con l'ordinamento impostato.
   * - I record soft-deleted non vengono inclusi per default, a meno che `includeDeleted = true`.
   */
  protected applyQueryOptions(query: any, options?: QueryOptions) {
    // 1. Filtra i record soft-deleted
    if (!options?.includeDeleted) {
      query = query.eq('is_deleted', false);
    }

    // 2. Determina colonna e direzione per l'ordinamento
    const orderColumn = options?.orderBy?.column || 'created_at';
    const ascending = options?.orderBy?.ascending ?? true;
    query = query.order(orderColumn, { ascending });

    // 3. Limite di default
    const limit = options?.limit ?? 10;

    // 4. Paginazione
    if (options?.cursor) {
      // Cursor-based pagination
      query = query.gt(orderColumn, options.cursor);
      query = query.limit(limit);
    } else {
      // Offset-based pagination
      const offset = options?.offset ?? 0;
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

      const lastItem = data && data.length > 0 ? data[data.length - 1] as any : null;
      const nextCursor = lastItem && data.length === (options?.limit || 10)
        ? lastItem[options?.orderBy?.column || 'created_at']
        : undefined;

      return {
        data: data as unknown as Entity[],
        meta: { count: count || 0, nextCursor }
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
      
      const lastItem = data && data.length > 0 ? data[data.length - 1] as any : null;
      const nextCursor = lastItem && data.length === (options?.limit || 10)
        ? lastItem[options?.orderBy?.column || 'created_at']
        : undefined;

      return {
        data: data as unknown as Entity[],
        meta: { count: count || 0, nextCursor }
      };
    } catch (error) {
      this.handleError(error, 'findWhere');
    }
  }

  // ===========================
  // READ METHODS (SINGLE)
  // ===========================

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

  // ===========================
  // WRITE METHODS
  // ===========================

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
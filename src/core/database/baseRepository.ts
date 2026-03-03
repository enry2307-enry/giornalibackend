// src/core/database/BaseRepository.ts
import supabase from './supabase';
import { RepositoryError, EntityNotFoundError, FindOptions, QueryOptions } from '../../types/repository';

/**
 * BaseRepository<T>
 * * Abstract base class providing standard CRUD operations for database tables.
 * * SETUP:
 * 1. Define your entity interface with required `id: string` field
 * 2. Extend BaseRepository with your entity type
 * 3. Set `tableName` to match your database table
 * 4. Set `defaultSelect` to comma-separated column list (never use "*")
 * * EXAMPLE:
 * ```typescript
 * export interface Viewer {
 * id: string;
 * user_id: string;
 * name: string;
 * email: string;
 * created_at: string;
 * is_deleted: boolean;
 * }
 * * export class ViewerRepository extends BaseRepository<Viewer> {
 * protected tableName = 'viewers';
 * protected defaultSelect = 'id,user_id,name,email,created_at';
 * }
 * ```
 * * INHERITED METHODS:
 * * findAll(options?: FindOptions): Promise<T[]>
 * - Returns all records matching criteria
 * - options.select: ['id', 'name'] - override default columns
 * - options.includeDeleted: true - include soft-deleted records
 * - options.limit: 50 - limit results
 * - options.offset: 100 - skip records for pagination
 * - options.orderBy: { column: 'created_at', ascending: false }
 * * findById(id: string, options?: FindOptions): Promise<T>
 * - Returns single record by ID
 * - Throws EntityNotFoundError if not found
 * - Respects includeDeleted option
 * * findWhere(conditions: Record<string, any>, options?: FindOptions): Promise<T[]>
 * - Returns records matching all conditions
 * - conditions: { user_id: '123', status: 'active' }
 * - Uses equality (eq) for all conditions
 * * findOneWhere(conditions: Record<string, any>, options?: FindOptions): Promise<T | null>
 * - Returns first matching record or null
 * - Same conditions format as findWhere
 * * create(item: Omit<T, 'id'>): Promise<T>
 * - Inserts new record
 * - Returns created record with generated ID
 * * update(id: string, item: Partial<Omit<T, 'id'>>): Promise<T>
 * - Updates existing record
 * - Throws EntityNotFoundError if not found or soft-deleted
 * - Returns updated record
 * * softDelete(id: string): Promise<void>
 * - Sets is_deleted = true
 * - Record still exists but excluded from queries by default
 * * hardDelete(id: string): Promise<void>
 * - Permanently removes record from database
 * - Use sparingly, prefer softDelete
 * * WRITING CUSTOM METHODS:
 * * Use inherited helper methods in your custom queries:
 * * - this.getSelectString(options) 
 * Returns select clause from options or defaultSelect
 * * - this.applyQueryOptions(query, options)
 * Applies is_deleted filter, pagination, sorting to query
 * * - this.handleError(error, context)
 * Wraps errors in RepositoryError with context
 * * CUSTOM METHOD PATTERNS:
 * * // Simple wrapper around findWhere
 * async findByUserId(userId: string): Promise<Viewer | null> {
 * return this.findOneWhere({ user_id: userId });
 * }
 * * // Custom query with options support
 * async findActiveViewers(options?: FindOptions): Promise<Viewer[]> {
 * return this.findAll({ 
 * ...options,
 * orderBy: { column: 'created_at', ascending: false }
 * });
 * }
 * * // Complex query with raw Supabase client
 * async findViewersWithCounts(userId: string): Promise<ViewerWithCount[]> {
 * try {
 * let query = supabase
 * .from(this.tableName)
 * .select('id,name,email,sessions:session_table(count)');
 * * query = query.eq('user_id', userId);
 * query = this.applyQueryOptions(query); // Apply is_deleted filter
 * * const { data, error } = await query;
 * * if (error) throw error;
 * return data as ViewerWithCount[];
 * } catch (error) {
 * this.handleError(error, 'findViewersWithCounts');
 * }
 * }
 * * // Method with custom filtering beyond equality
 * async findViewersByDateRange(
 * startDate: string, 
 * endDate: string
 * ): Promise<Viewer[]> {
 * try {
 * let query = supabase
 * .from(this.tableName)
 * .select(this.defaultSelect)
 * .gte('created_at', startDate)
 * .lte('created_at', endDate);
 * * query = this.applyQueryOptions(query); // Handles is_deleted
 * * const { data, error } = await query;
 * * if (error) throw error;
 * return data as Viewer[];
 * } catch (error) {
 * this.handleError(error, 'findViewersByDateRange');
 * }
 * }
 * * // Bulk operation
 * async createMany(items: Omit<Viewer, 'id'>[]): Promise<Viewer[]> {
 * try {
 * const { data, error } = await supabase
 * .from(this.tableName)
 * .insert(items)
 * .select(this.defaultSelect);
 * * if (error) throw error;
 * return data as Viewer[];
 * } catch (error) {
 * this.handleError(error, 'createMany');
 * }
 * }
 * * // Transaction-like operation
 * async transferOwnership(
 * viewerId: string, 
 * newUserId: string
 * ): Promise<Viewer> {
 * try {
 * // Verify viewer exists first
 * await this.findById(viewerId);
 * * // Update ownership
 * return await this.update(viewerId, { user_id: newUserId });
 * } catch (error) {
 * if (error instanceof EntityNotFoundError) throw error;
 * this.handleError(error, 'transferOwnership');
 * }
 * }
 * * RULES:
 * * 1. Always wrap Supabase calls in try-catch
 * 2. Always call this.handleError(error, 'methodName') in catch blocks
 * 3. Use this.applyQueryOptions() to respect is_deleted filter
 * 4. Use this.getSelectString(options) for consistent column selection
 * 5. Return EntityNotFoundError as-is, wrap all other errors
 * 6. Cast final result as your type: `data as T` or `data as T[]`
 * 7. Prefer reusing findWhere/findOneWhere over raw queries when possible
 * 8. Never expose Supabase client outside repository layer
 * * ERROR HANDLING IN CONTROLLERS:
 * * try {
 * const viewer = await viewerRepo.findById(id);
 * res.json(viewer);
 * } catch (error) {
 * if (error instanceof EntityNotFoundError) {
 * return res.status(404).json({ error: error.message });
 * }
 * if (error instanceof RepositoryError) {
 * return res.status(500).json({ error: 'Database error' });
 * }
 * throw error; // Unexpected error
 * }
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

  async findAll(options?: FindOptions): Promise<Entity[]> {
    try {
      let query = supabase
        .from(this.tableName)
        .select(this.getSelectString(options));

      query = this.applyQueryOptions(query, options);

      const { data, error } = await query;
      
      if (error) throw error;
      return data as unknown as Entity[];
    } catch (error) {
      this.handleError(error, 'findAll');
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
        if (error.code === 'PGRST116') {
          throw new EntityNotFoundError(this.tableName, id);
        }
        throw error;
      }

      return data as unknown as Entity;
    } catch (error) {
      if (error instanceof EntityNotFoundError) throw error;
      this.handleError(error, 'findById');
    }
  }

  async findWhere(
    conditions: Record<string, any>,
    options?: FindOptions
  ): Promise<Entity[]> {
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
      return data as unknown as Entity[];
    } catch (error) {
      this.handleError(error, 'findWhere');
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
        if (error.code === 'PGRST116') {
          throw new EntityNotFoundError(this.tableName, id);
        }
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
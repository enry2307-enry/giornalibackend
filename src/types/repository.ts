import { AppError } from '../errors/AppError';

/**
 * Errore tecnico del database.
 * Mappa a un 500 perché indica un fallimento dell'infrastruttura.
 */
export class RepositoryError extends AppError {
  constructor(message: string, public readonly cause?: unknown) {
    super(message, 500, 'DATABASE_ERROR');
    this.name = 'RepositoryError';
  }
}

/**
 * Errore di dominio: la risorsa cercata non esiste.
 * NON estende AppError per evitare "leaking" di HTTP status nel repository.
 * Sarà il middleware a mapparlo a un 404.
 */
export class EntityNotFoundError extends Error {
  constructor(public resource: string, public id: string) {
    super(`${resource} with id ${id} not found`);
    this.name = 'EntityNotFoundError';
  }
}

export interface QueryOptions {
  includeDeleted?: boolean;
  limit?: number;
  offset?: number;
  orderBy?: { column: string; ascending?: boolean };
  cursor?: string;      // cursor-based (lastId)
}

export interface FindOptions extends QueryOptions {
  select?: string[];
}
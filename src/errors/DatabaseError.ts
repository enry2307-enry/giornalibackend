// src/errors/DatabaseError.ts
import { AppError } from './AppError';

export class DatabaseError extends AppError {
  constructor(message = 'Database operation failed', cause?: unknown) {
    super(message, 500, 'DATABASE_ERROR');
    this.cause = cause;
  }

  override cause?: unknown;
}
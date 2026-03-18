// src/middleware/errHandler.middleware.ts
// src/middleware/errHandler.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { EntityNotFoundError } from '../core/database/repository.types';
import { DatabaseError } from '../errors/DatabaseError';

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = 500;
  let code = 'INTERNAL_ERROR';
  let message = err.message || 'Internal Server Error';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    code = err.code || 'APP_ERROR';
  } else if (err instanceof EntityNotFoundError) {
    statusCode = 404;
    code = 'NOT_FOUND';
  } else if (err instanceof DatabaseError) {
    statusCode = 500;
    code = 'DATABASE_ERROR';
    message = 'Internal Server Error';
  }

  if (statusCode === 500) {
    console.error('SYSTEM ERROR:', err);
  }

  res.status(statusCode).json({
    status: statusCode >= 400 && statusCode < 500 ? 'fail' : 'error',
    message,
    code,
  });
};
import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../errors/AppError';
import { UserStatus } from '../domains/auth/auth.types';

export const requiresActiveUser = (req: Request, _res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new ForbiddenError('Authentication required');
  }

  if (req.user.status !== UserStatus.ACTIVE) {
    throw new ForbiddenError(
      `Access denied. Current account status: ${req.user.status}. Please verify your email.`
    );
  }

  next();
};
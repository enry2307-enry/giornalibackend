import { Request, Response, NextFunction } from 'express';
import { jwtUtils } from '../core/utils/jwt';
import { ForbiddenError } from '../errors/AppError';
import { UserSession, UserStatus } from '../domains/auth/auth.types';

export const requiresAuth = async (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ForbiddenError('Access Denied'));
  }

  const token = authHeader.split(' ')[1];
  let decoded: UserSession;

  try {
    decoded = jwtUtils.verifyAccessToken(token) as UserSession;
  } catch (error) {
    return next(new ForbiddenError('Token expired or invalid'));
  }

  req.user = { 
    id: decoded.id,
    status: decoded.status,
    token_version: decoded.token_version
  };

  if (req.user.status === UserStatus.SUSPENDED) {
    return next(new ForbiddenError('Account permanently suspended. Cannot perform any action'));
  }

  next();
};
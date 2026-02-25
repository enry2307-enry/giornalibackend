import { Request, Response, NextFunction } from 'express';
import { jwtUtils } from '../core/utils/jwt';
import { ForbiddenError } from '../errors/AppError';

export const protect = async (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ForbiddenError('Access Denied'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwtUtils.verifyAccessToken(token) as { id: string, token_version: number };

    (req as any).user = { 
      id: decoded.id,
      token_version: decoded.token_version
    };
    next();
  } catch (error) {
    next(new ForbiddenError('Token expired or invalid'));
  }
};
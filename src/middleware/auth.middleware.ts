import { Request, Response, NextFunction } from 'express';
import { jwtUtils } from '../core/utils/jwt';
import { ForbiddenError } from '../errors/AppError';

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ForbiddenError('Access Denied'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwtUtils.verifyAccessToken(token) as { id: string };

    (req as any).user = { id: decoded.id };
    next();
  } catch (error) {
    next(new ForbiddenError('Token expired or invalid'));
  }
};
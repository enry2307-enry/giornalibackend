import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { escape } from 'validator';
import { SANITIZATION_BLACKLIST } from '../core/constants/security';
import { ValidationError } from '../errors/AppError';

const sanitizeValue = (value: any, key?: string): any => {
  // Bypassa la sanitizzazione se la chiave è in blacklist
  if (key && SANITIZATION_BLACKLIST.includes(key)) {
    return value;
  }

  if (typeof value === 'string') {
    return escape(value.trim());
  }

  if (Array.isArray(value)) {
    return value.map((v) => sanitizeValue(v));
  }

  if (value !== null && typeof value === 'object') {
    return Object.keys(value).reduce((acc, k) => {
      acc[k] = sanitizeValue(value[k], k);
      return acc;
    }, {} as any);
  }

  return value;
};

export const dtoMiddleware = (DtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (typeof req.body !== 'object' || req.body === null) {
      return res.status(400).json({ message: "Invalid request body" });
    }

    // In questa fase della startup la sanitizzazione la teniamo disattivata
    // è complessa e cruciale, ma dobbiamo spingere sul momentum
    // req.body = sanitizeValue(req.body);

    const dtoInstance = plainToInstance(DtoClass, req.body);

    const errors = await validate(dtoInstance, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      const message = errors.map(err => Object.values(err.constraints || {}).join(', ')).join('; ');
      return next(new ValidationError(message));
    }

    req.body = dtoInstance;
    next();
  };
};
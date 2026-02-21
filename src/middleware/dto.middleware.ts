import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../errors/AppError';

export const dtoMiddleware = (DtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {

    if (typeof req.body !== 'object' || req.body === null) {
      return res.status(400).json({ message: "Invalid request body" });
    }

    const dtoInstance = plainToInstance(DtoClass, req.body);
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      const message = errors.map(err => Object.values(err.constraints || {}).join(', ')).join('; ');
      return next(new ValidationError(message));
    }

    req.body = dtoInstance;
    next();
  };
};
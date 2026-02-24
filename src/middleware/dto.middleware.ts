import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../errors/AppError';

export const dtoMiddleware = (DtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {

    if (typeof req.body !== 'object' || req.body === null) {
      return res.status(400).json({ message: "Invalid request body" });
    }

    // Trasforma il plain object in istanza della classe DTO
    const dtoInstance = plainToInstance(DtoClass, req.body);

    // Esegue la validazione con restrizioni sui campi extra
    const errors = await validate(dtoInstance, {
      whitelist: true,               // Rimuove i campi che non hanno decoratori nel DTO
      forbidNonWhitelisted: true,    // Genera un errore se sono presenti campi non consentiti
    });

    if (errors.length > 0) {
      const message = errors.map(err => Object.values(err.constraints || {}).join(', ')).join('; ');
      return next(new ValidationError(message));
    }

    // Sovrascrive req.body con l'istanza validata e pulita
    req.body = dtoInstance;
    next();
  };
};
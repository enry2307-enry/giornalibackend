import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../errors/AppError';
import { UserBaseService } from '../services/userBase';

const userBaseService = new UserBaseService();

// Centralize validation
const requireFields = (fields: Record<string, any>) => {
  for (const [name, value] of Object.entries(fields)) {
    if (!value) throw new ValidationError(`${name} required`);
  }
};

export const userBaseController = {
  getById: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      requireFields({ userId: req.params.userId });
      const user = await userBaseService.getById(req.params.userId);
      res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  },

  getByEmail: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      requireFields({ email: req.body.email });
      const user = await userBaseService.getByEmail(req.body.email);  // FIX: was getById
      res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  },

  signUp: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password, passwordConfirmation } = req.body;
      requireFields({ email, password, passwordConfirmation });
      
      if (password !== passwordConfirmation) {
        throw new ValidationError("Passwords don't match");
      }

      const user = await userBaseService.create(email, password);
      res.status(201).json({ user });
    } catch (error) {
      next(error);
    }
  },

  updatePassword: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { oldPassword, newPassword, newPasswordConfirmation } = req.body;
      requireFields({ 
        userId: req.params.userId,
        oldPassword, 
        newPassword, 
        newPasswordConfirmation 
      });

      if (newPassword !== newPasswordConfirmation) {
        throw new ValidationError("Passwords don't match");
      }

      const user = await userBaseService.updatePassword(
        req.params.userId,
        oldPassword,
        newPassword
      );
      res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  },

  softDelete: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      requireFields({ 
        userId: req.params.userId,
        password: req.body.password 
      });

      const user = await userBaseService.softDelete(
        req.params.userId,
        req.body.password
      );
      res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  }
};
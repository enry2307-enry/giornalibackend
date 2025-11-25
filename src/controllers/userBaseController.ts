import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../errors/AppError';
import { UserBaseService } from '../services/userBaseService';

const userBaseService = new UserBaseService();

export const UserBaseList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.send('NOT IMPLEMENTED: UserBase list');
  } catch (error) {
    next(error);
  }
}

export const UserBaseDetail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.send('NOT IMPLEMENTED: UserBase detail: ' + req.params.id);
  } catch (error) {
    next(error);
  }
}

export const UserBaseRegister = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if(!req.body.email) {
      throw new ValidationError("Email required");
    }
    if(!req.body.password) {
      throw new ValidationError("Password required");
    }
    if(!req.body.password_check) {
      throw new ValidationError("Password Check required");
    }
    if(req.body.password !== req.body.password_check) {
      throw new ValidationError('Passwords don\'t match');
    }

    const user = await userBaseService.create(
      req.body.email, 
      req.body.password
    );

    res.status(201).json({ user });

  } catch (error) {
    next(error);
  }
}
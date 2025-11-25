import { Request, Response, NextFunction } from 'express';

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
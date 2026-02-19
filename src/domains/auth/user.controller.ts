import { Request, Response } from 'express';
import { authService } from './auth.service';
import { catchAsync } from '../../utils/catchAsync';

export const authController = {
  
  register: catchAsync(async (req: Request, res: Response) => {
    const user = await authService.register(req.body);
    
    res.status(201).json({
      status: 'success',
      data: user
    });
  }),

  // Esempio per il login
  login: catchAsync(async (req: Request, res: Response) => {
    const session = await authService.login(req.body);
    res.status(200).json({
      status: 'success',
      data: session
    });
  })
};
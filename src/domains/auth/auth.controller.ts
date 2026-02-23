import { Request, Response } from 'express';
import { authService } from './auth.service';
import { catchAsync } from '../../utils/catchAsync';
import config from '../../config/config';

export const authController = {
  
  register: catchAsync(async (req: Request, res: Response) => {
    const { user, accessToken, refreshToken } = await authService.register(req.body);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/'
    });

    res.status(201).json({ 
      status: 'success',
      data: {
        user, 
        accessToken
      } 
    });
  }),

  login: catchAsync(async (req: Request, res: Response) => {
    const { user, accessToken, refreshToken } = await authService.login(req.body);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/'
    });

    res.status(200).json({ 
      status: 'success',
      data: {
        user, 
        accessToken
      } 
    });
  }),

  refresh: catchAsync(async (req: Request, res: Response) => {
    const { refreshToken: token } = req.cookies;
    const { user, accessToken, refreshToken: newRefreshToken } = await authService.refresh(token);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/'
    });

    res.status(200).json({ 
      status: 'success',
      data: {
        user, 
        accessToken
      } 
    });
  }),

  logout: catchAsync(async (_req: Request, res: Response) => {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: 'strict',
      path: '/'
    });

    res.status(204).send();
  }),

  getMe: catchAsync(async (req: Request, res: Response) => {
    const user = await authService.getSession(req.user.id);

    res.status(200).json({ 
      status: 'success',
      data: {
        user
      } 
    });
  }),
};
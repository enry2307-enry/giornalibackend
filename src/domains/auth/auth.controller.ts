import { Request, Response } from 'express';
import { authService } from './auth.service';
import { catchAsync } from '../../utils/catchAsync';
import config from '../../config/config';
import { ValidationError } from '../../errors/AppError';

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

  updatePassword: catchAsync(async (req: Request, res: Response) => {
    const { oldPassword, newPassword } = req.body;
    const user = await authService.updatePassword(req.user.id, oldPassword, newPassword);

    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  }),

  sendVerificationEmail: catchAsync(async (req: Request, res: Response) => {
    await authService.sendVerificationEmail(req.user.id);

    res.status(200).json({
      status: 'success',
      message: 'Confirmation email sent. Please check your inbox'
    });
  }),

  verifyEmail: catchAsync(async (req: Request, res: Response) => {
    const { code } = req.query;

    // Validazione rapida. Probabilmente scalerà in futuro
    if (!code || typeof code !== 'string') {
      throw new ValidationError('Verification code is required');
    }

    await authService.verifyEmail(code);

    res.status(200).json({
      status: 'success',
      message: 'Email verified successfully. You can now access all features.'
    });
  })
};
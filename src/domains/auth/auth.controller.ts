import { Request, Response } from 'express';
import { authService } from './auth.service';
import { catchAsync } from '../../utils/catchAsync';
import config from '../../config/config';
import { ValidationError } from '../../errors/AppError';
import { toResponse } from '../../core/utils/objects.utils';
import { AUTH_CONSTANTS } from '../../core/constants/auth.constants';

export const authController = {
  
  register: catchAsync(async (req: Request, res: Response) => {
    await authService.register(req.body);
    res.status(201).json(
      toResponse({ 
        message: AUTH_CONSTANTS.REGISTER.GENERIC_MESSAGE
      }));
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

    res.status(200).json(
      toResponse({
        data: {
          user,
          accessToken
        }
      })
    );
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

    res.status(200).json(
      toResponse({
        data: {
          user,
          accessToken
        }
      })
    );
  }),

  logout: catchAsync(async (_req: Request, res: Response) => {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: 'strict',
      path: '/'
    });

    res.status(204).json(
      toResponse({
        message: 'Logout success.'
      })
    );
  }),

  getMe: catchAsync(async (req: Request, res: Response) => {
    const user = await authService.getMe(req.user.id);

    res.status(200).json(
      toResponse({
        data: { user }
      })
    );
  }),

  updatePassword: catchAsync(async (req: Request, res: Response) => {
    const { oldPassword, newPassword } = req.body;
    const user = await authService.updatePassword(req.user.id, oldPassword, newPassword);

    res.status(200).json(
      toResponse({data: user})
    );
  }),

  sendVerificationEmail: catchAsync(async (req: Request, res: Response) => {
    await authService.sendVerificationEmail(req.user.id);

    res.status(200).json(toResponse({message: 'Confirmation email sent, please check your inbox'}));
  }),

  verifyEmail: catchAsync(async (req: Request, res: Response) => {
    const { code } = req.query;

    // Validazione rapida. Probabilmente scalerà in futuro
    if (!code || typeof code !== 'string') {
      throw new ValidationError('Verification code is required');
    }

    await authService.verifyEmail(code);

    res.status(200).json(toResponse({message: 'Email successfully verified. You can now access all features'}));
  })
};
import { Router } from 'express';
import { authController } from './auth.controller';
import { RegisterUserDTO, LoginDTO } from './auth.dto';
import { dtoMiddleware } from '../../middleware/dto.middleware';
import { requiresAuth } from '../../middleware/auth.middleware';
import { requiresActiveUser } from '../../middleware/activeUser.middleware';

export const authRouter = Router();

// Auth Routes
authRouter.post ('/register', dtoMiddleware(RegisterUserDTO), authController.register);         // POST /api/v1/auth/register
authRouter.post ('/login'   , dtoMiddleware(LoginDTO), authController.login);                   // POST /api/v1/auth/login
authRouter.post ('/refresh' , authController.refresh);                                          // POST /api/v1/auth/refresh
authRouter.post ('/logout'  , requiresAuth, authController.logout);                             // POST /api/v1/auth/logout

// User & Security Routes
authRouter.get  ('/me',       requiresAuth, authController.getMe);                              // GET   /api/v1/auth/me
authRouter.patch('/password', requiresAuth, requiresActiveUser, authController.updatePassword); // PATCH /api/v1/auth/password

// Email verification and password reset
authRouter.get  ('/verify-email', authController.verifyEmail)                                   // GET   /api/v1/auth/verify?code=<UUID>
authRouter.post ('/verify-email/resend', requiresAuth, authController.sendVerificationEmail);   // POST  /api/v1/auth/verify/resend
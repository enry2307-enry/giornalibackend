import { Router } from 'express';
import { authController } from './auth.controller';
import { RegisterUserDTO, LoginDTO } from './auth.dto';
import { dtoMiddleware } from '../../middleware/dto.middleware';
import { protect } from '../../middleware/auth.middleware';

export const authRouter = Router();

// RESTful patterns
authRouter.post('/register',          dtoMiddleware(RegisterUserDTO), authController.register);            // POST /api/v1/auth/register
authRouter.post('/login'   ,          dtoMiddleware(LoginDTO)      ,  authController.login);               // POST /api/v1/auth/login
authRouter.post('/refresh' ,                                          authController.refresh);             // POST /api/v1/auth/refresh
authRouter.post('/logout'  , protect,                                 authController.logout);              // POST /api/v1/auth/logout
authRouter.get ('/me',       protect,                                 authController.getMe);               // GET  /api/v1/auth/me
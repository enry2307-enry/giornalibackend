import { Router } from 'express';
import { authController } from './user.controller';
import { CreateUserDTO } from './auth.dto';
import { dtoMiddleware } from '../../middleware/dtoMiddleware';

export const userRouter = Router();

// RESTful patterns
userRouter.post('/register', dtoMiddleware(CreateUserDTO), authController.register);    // POST /user/register
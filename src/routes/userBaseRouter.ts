import { Router } from 'express';
import { UserBaseRegister, UserBaseUpdatePassword, UserBaseGetById } from '../controllers/userBaseController'; 

const UserBaseRouter = Router();

UserBaseRouter.post('/register', UserBaseRegister);

UserBaseRouter.post('/change-password', UserBaseUpdatePassword);

UserBaseRouter.get('/:userId/details', UserBaseGetById);

export { UserBaseRouter };
import { Router, Request, Response, NextFunction } from 'express';
import { UserBaseRegister } from '../controllers/userBaseController'; 

const UserBaseRouter = Router();

UserBaseRouter.post('/register', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  await UserBaseRegister(req, res, next);  
});

export { UserBaseRouter };
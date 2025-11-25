import { Router, Request, Response } from 'express';

const UserBaseRouter = Router();

UserBaseRouter.get('/', (req: Request, res: Response): void => {
  res.send('User Base Route');
});
import { Router } from 'express';
import { 
  userBaseController
} from '../controllers/userBase';

export const userBaseRouter = Router();

// TO DO
// When JWT is implemented, remove the :userId param from URL
// Since userId will be taken from authentication

// RESTful patterns
userBaseRouter.post('/register', userBaseController.signUp);                // POST /userbase/register
userBaseRouter.put('/:userId/password', userBaseController.updatePassword); // PUT /userbase/:userId/password
userBaseRouter.delete('/:userId', userBaseController.softDelete);           // DELETE /userbase/:userId
userBaseRouter.get('/:userId', userBaseController.getById);                 // GET /userbase/:userId


import { Router } from 'express';
import { 
  UserBaseRegister, 
  UserBaseUpdatePassword, 
  UserBaseGetById,
  UserBaseSoftDelete
} from '../controllers/userBaseController';

const UserBaseRouter = Router();

// TO DO
// When JWT is implemented, remove the :userId param from URL
// Since userId will be taken from authentication

// RESTful patterns
UserBaseRouter.post('/register', UserBaseRegister);              // POST /userbase/register
UserBaseRouter.put('/:userId/password', UserBaseUpdatePassword); // PUT /userbase/:userId/password
UserBaseRouter.delete('/:userId', UserBaseSoftDelete);           // DELETE /userbase/:userId
UserBaseRouter.get('/:userId', UserBaseGetById);                 // GET /userbase/:userId

export { UserBaseRouter };
import { Router } from 'express';
import { 
  ViewerCreate, 
  ViewerUpdate, 
  ViewerSoftDelete, 
  ViewerGetById, 
  ViewerGetMe 
} from '../controllers/viewer';

const ViewerRouter = Router();

// TO DO
// When JWT is implemented, remove the :userId param from URL
// Since userId will be taken from authentication

ViewerRouter.post(   '/',           ViewerCreate);            // POST /viewer
ViewerRouter.get(    '/me/:userId', ViewerGetMe);             // GET /viewer/me/:userId (specific route first)
ViewerRouter.get(    '/:viewerId',  ViewerGetById);           // GET /viewer/:viewerId (generic route last)
ViewerRouter.put(    '/:viewerId',  ViewerUpdate);            // PUT /viewer/:viewerId
ViewerRouter.delete( '/:viewerId',  ViewerSoftDelete);        // DELETE /viewer/:viewerId

export { ViewerRouter };
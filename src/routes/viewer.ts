import { Router } from 'express';
import { 
  viewerController
} from '../controllers/viewer';

const ViewerRouter = Router();

// TO DO
// When JWT is implemented, remove the :userId param from URL
// Since userId will be taken from authentication

ViewerRouter.post(   '/',           viewerController.create);            // POST /viewer
ViewerRouter.get(    '/me/:userId', viewerController.getMe);             // GET /viewer/me/:userId (specific route first)
ViewerRouter.get(    '/:viewerId',  viewerController.getById);           // GET /viewer/:viewerId (generic route last)
ViewerRouter.put(    '/:viewerId',  viewerController.update);            // PUT /viewer/:viewerId
ViewerRouter.delete( '/:viewerId',  viewerController.softDelete);        // DELETE /viewer/:viewerId

export { ViewerRouter };
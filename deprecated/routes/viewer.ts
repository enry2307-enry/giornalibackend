import { Router } from 'express';
import { 
  viewerController
} from '../controllers/viewer';

const viewerRouter = Router();

// TO DO
// When JWT is implemented, remove the :userId param from URL
// Since userId will be taken from authentication

viewerRouter.post(   '/',           viewerController.create);            // POST /viewer
viewerRouter.get(    '/me/:userId', viewerController.getMe);             // GET /viewer/me/:userId (specific route first)
viewerRouter.get(    '/:viewerId',  viewerController.getById);           // GET /viewer/:viewerId (generic route last)
viewerRouter.put(    '/:viewerId',  viewerController.update);            // PUT /viewer/:viewerId
viewerRouter.delete( '/:viewerId',  viewerController.softDelete);        // DELETE /viewer/:viewerId

export { viewerRouter };
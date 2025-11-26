import { Router } from 'express';
import { ViewerCreate } from '../controllers/viewerController';

const ViewerRouter = Router();

ViewerRouter.post('/create', ViewerCreate);

export { ViewerRouter };
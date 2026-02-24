import { Router } from 'express';
import { dtoMiddleware } from '../../middleware/dto.middleware';
import { protect } from '../../middleware/auth.middleware';
import { publisherController } from './publisher/publisher.controller';

import { PublisherCreateDTO, PublisherUpdateDTO, PublisherDeleteDTO } from './publisher/publisher.dto';
import { ViewerCreateDTO, ViewerDeleteDTO, ViewerUpdateDTO } from './viewer/viewer.dto';

import { viewerController } from './viewer/viewer.controller';

export const profileRouter = Router();

//RESTful patterns
profileRouter.post('/publishers', protect, dtoMiddleware(PublisherCreateDTO), publisherController.create);     // POST   /api/v1/profiles/publishers
profileRouter.patch('/publishers', protect, dtoMiddleware(PublisherUpdateDTO), publisherController.update);    // PATCH  /api/v1/profiles/publishers
profileRouter.delete('/publishers', protect, dtoMiddleware(PublisherDeleteDTO), publisherController.delete);   // DELETE /api/v1/profiles/publishers
profileRouter.get('/publishers/:publisherId', protect, publisherController.getById);                           // GET    /api/v1/profiles/publishers/:publisherId

profileRouter.post('/viewers', protect, dtoMiddleware(ViewerCreateDTO), viewerController.create)               // POST   /api/v1/profiles/viewers
profileRouter.patch('/viewers', protect, dtoMiddleware(ViewerUpdateDTO), viewerController.update)              // PATCH  /api/v1/profiles/viewers
profileRouter.delete('/viewers', protect, dtoMiddleware(ViewerDeleteDTO), viewerController.delete)             // DELETE /api/v1/profiles/viewers
profileRouter.get('/viewers/:viewerId', protect, viewerController.getById);                                    // GET    /api/v1/profiles/viewers/:viewerId



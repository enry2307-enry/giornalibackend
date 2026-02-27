import { Router } from 'express';
import { dtoMiddleware } from '../../middleware/dto.middleware';
import { requiresAuth } from '../../middleware/auth.middleware';
import { publisherController } from './publisher/publisher.controller';

import { PublisherCreateDTO, PublisherUpdateDTO, PublisherDeleteDTO } from './publisher/publisher.dto';
import { ViewerCreateDTO, ViewerDeleteDTO, ViewerUpdateDTO } from './viewer/viewer.dto';

import { viewerController } from './viewer/viewer.controller';

export const profileRouter = Router();

//RESTful patterns
profileRouter.post('/publishers', requiresAuth, dtoMiddleware(PublisherCreateDTO), publisherController.create);     // POST   /api/v1/profiles/publishers
profileRouter.patch('/publishers', requiresAuth, dtoMiddleware(PublisherUpdateDTO), publisherController.update);    // PATCH  /api/v1/profiles/publishers
profileRouter.delete('/publishers', requiresAuth, dtoMiddleware(PublisherDeleteDTO), publisherController.delete);   // DELETE /api/v1/profiles/publishers
profileRouter.get('/publishers/:publisherId', requiresAuth, publisherController.getById);                           // GET    /api/v1/profiles/publishers/:publisherId

profileRouter.post('/viewers', requiresAuth, dtoMiddleware(ViewerCreateDTO), viewerController.create)               // POST   /api/v1/profiles/viewers
profileRouter.patch('/viewers', requiresAuth, dtoMiddleware(ViewerUpdateDTO), viewerController.update)              // PATCH  /api/v1/profiles/viewers
profileRouter.delete('/viewers', requiresAuth, dtoMiddleware(ViewerDeleteDTO), viewerController.delete)             // DELETE /api/v1/profiles/viewers
profileRouter.get('/viewers/:viewerId', requiresAuth, viewerController.getById);                                    // GET    /api/v1/profiles/viewers/:viewerId



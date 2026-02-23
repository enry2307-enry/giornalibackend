import { Router } from 'express';
import { dtoMiddleware } from '../../middleware/dto.middleware';
import { protect } from '../../middleware/auth.middleware';
import { publisherController } from './publisher/publisher.controller';

import { PublisherCreateDTO, PublisherUpdateDTO } from './profiles.dto';

export const profileRouter = Router();

//RESTful patterns
profileRouter.post('/publishers', protect, dtoMiddleware(PublisherCreateDTO), publisherController.create);   // POST   /api/v1/profiles/publishers
profileRouter.patch('/publishers', protect, dtoMiddleware(PublisherUpdateDTO), publisherController.update);  // PATCH  /api/v1/profiles/publishers
profileRouter.delete('/publishers', protect, publisherController.delete);                                    // DELETE /api/v1/profiles/publishers
profileRouter.get('/publishers/:publisherId', protect, publisherController.getById);                         // GET    /api/v1/profiles/publishers/:publisherId
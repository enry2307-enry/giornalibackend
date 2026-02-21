import { Router } from 'express';
import { dtoMiddleware } from '../../middleware/dto.middleware';
import { protect } from '../../middleware/auth.middleware';
import { publisherController } from './publisher/publisher.controller';

import { PublisherCreateDTO } from './profiles.dto';

export const profileRouter = Router();

//RESTful patterns
profileRouter.post('/publishers', protect, dtoMiddleware(PublisherCreateDTO), publisherController.create); // POST /api/v1/profiles/publishers
//src/domains/profiles/publisher/publisher.controller.ts

import { Request, Response } from 'express';
import { catchAsync } from '../../../utils/catchAsync';
import { publisherService } from './publisher.service';

export const publisherController = {
  create: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.id; 
    const publisherData = req.body;

    const newPublisher = await publisherService.create(userId, publisherData);

    res.status(201).json({
      status: 'success',
      data: { publisher: newPublisher }
    });
  })
};
//src/domains/profiles/publisher/publisher.controller.ts

import { Request, Response } from 'express';
import { catchAsync } from '../../../utils/catchAsync';
import { publisherService } from './publisher.service';
import { ValidationError } from '../../../errors/AppError';

export const publisherController = {
  create: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.id; 
    const publisherData = req.body;

    const newPublisher = await publisherService.create(userId, publisherData);

    res.status(201).json({
      status: 'success',
      data: { publisher: newPublisher }
    });
  }),

  update: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const publisherUpdateData = req.body;

    const publisher = await publisherService.update(userId, publisherUpdateData);

    res.status(200).json({
      status: 'success',
      data: { publisher }
    });
  }),

  getById: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    if(!id) throw new ValidationError('Missing required URL parameter id');

    const publisher = await publisherService.getById(id);

    res.status(200).json({
      status: 'success',
      data: { publisher }
    });
  }),

  delete: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const { password } = req.body;

    await publisherService.delete(userId, password);

    res.status(204).send(); 
  })
};
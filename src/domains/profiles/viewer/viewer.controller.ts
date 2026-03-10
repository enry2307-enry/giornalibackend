import { Request, Response } from 'express';
import { catchAsync } from '../../../utils/catchAsync';
import { viewerService } from './viewer.service';
import { ValidationError } from '../../../errors/AppError';

export const viewerController = {
  create: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const data = req.body;

    const viewer = await viewerService.create(userId, data);

    res.status(201).json({
      status: 'success',
      data: { viewer }
    })
  }),

  getById: catchAsync(async (req: Request, res: Response) => {
    const { viewerId } = req.params;

    // andrà verificato con zod probabilmente
    if(!viewerId) throw new ValidationError('Invalid URL.');

    const viewer = await viewerService.getById(viewerId);

    res.status(200).json({
      status: 'success',
      data: { viewer }
    });
  }),

  update: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const data = req.body;

    const viewer = await viewerService.update(userId, data);

    res.status(200).json({
      status: 'success',
      data: { viewer }
    });
  }),

  delete: catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const password = req.body.password;

    const viewer = await viewerService.delete(userId, password);

    res.status(204).json({
      status: 'success',
      data: { viewer }
    });
  }),
}
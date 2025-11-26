import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../errors/AppError';
import { ViewerService } from '../services/viewerService';

const viewerService = new ViewerService();

export const ViewerCreate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.body.username) {
      throw new ValidationError("Username required");
    }
    if (!req.body.userId) {
      throw new ValidationError("UserId required");
    }

    const viewer = await viewerService.create(
      req.body.userId, 
      req.body.username,
      req.body.description || '',
      req.body.profile_image_url || ''
    );

    res.status(201).json({ viewer });
  
  } catch (error) {
    next(error);
  }
}
/**
 * TODO: JWT Authentication Migration
 * 
 * Currently using userId from route params and/or request body for development.
 * When JWT is implemented:
 * - Remove userId from route parameters
 * - Remove userId from request body
 * - Extract userId from req.user.id (JWT payload)
 * - Remove manual userId validation checks
 */

import { Request, Response, NextFunction } from 'express';
import { ViewerService } from '../services/viewer';
import { Viewer } from '../../src/types/models';
import { requireFields } from '../../utils/requireFields';

const viewerService = new ViewerService();

export const viewerController = {
  create: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId, username, description, profile_image_url } = req.body;
      requireFields({userId: userId, username: username});
      const viewer = await viewerService.create(
        userId, 
        username,
        description || null,
        profile_image_url || null
      );
      res.status(201).json({ viewer });
    } catch (error) {
      next(error);
    }
  },

  softDelete:async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId, password, passwordConfirmation } = req.body;
      requireFields({viewerId: req.params.viewerId, userId, password, passwordConfirmation});
      const viewer = await viewerService.softDelete(
        req.params.viewerId,
        req.body.userId,
        req.body.password
      );
      res.status(200).json({ viewer });
    } catch (error) {
      next(error);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId, description, profile_image_url } = req.body;
      requireFields({viewerId: req.params.viewerId, userId});
      const updates: Partial<Pick<Viewer, 'description' | 'profile_image_url'>> = {};
      
      if (description !== undefined) updates.description = description;
      if (profile_image_url !== undefined) updates.profile_image_url = profile_image_url;

      const viewer = await viewerService.update(
        userId,
        req.params.viewerId,
        updates
      );
      res.status(200).json({ viewer });
    } catch (error) {
      next(error);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      requireFields({viewerId: req.params.viewerId});
      const viewer = await viewerService.getById(req.params.viewerId);
      res.status(200).json({ viewer });
    } catch(error) {
      next(error);
    }
  },

  getMe: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      requireFields({userId: req.params.userId});
      const viewer = await viewerService.getMe(req.params.userId);
      res.status(200).json({ viewer });
    } catch (error) {
      next(error);
    }
  }
}
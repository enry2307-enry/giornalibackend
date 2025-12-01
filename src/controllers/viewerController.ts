import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../errors/AppError';
import { ViewerService } from '../services/viewerService';
import { Viewer } from '../types/models';

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
      req.body.description || null,
      req.body.profile_image_url || null
    );

    res.status(201).json({ viewer });
  
  } catch (error) {
    next(error);
  }
}

export const ViewerSoftDelete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {

    // TODO: After auth implementation, get from JWT token
    // const userId = req.user.id;

    if(!req.params.viewerId) {
      throw new ValidationError("ViewerId required");
    }
    if(!req.body.userId) {
      throw new ValidationError("UserId required"); // Remove this after JWT
    }
    if(!req.body.password) {
      throw new ValidationError("Password required");
    }
    if(!req.body.passwordConfirmation) {
      throw new ValidationError("Password confirmation required");
    }

    if(req.body.password !== req.body.passwordConfirmation) {
      throw new ValidationError("Passwords don't match");
    }

    const viewer = await viewerService.softDelete(
      req.params.viewerId,
      req.body.userId,  // this will be removed when JWT implemented
      req.body.password
    );

    res.status(200).json({ viewer });

  } catch (error) {
    next(error);
  }
}

export const ViewerUpdate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // TODO: After auth implementation, get userId from JWT token
    // const userId = req.user.id;
    
    if (!req.params.viewerId) {
      throw new ValidationError("ViewerId required");
    }
    if (!req.body.userId) {
      throw new ValidationError("UserId required"); // Remove after JWT
    }

    const updates: Partial<Pick<Viewer, 'description' | 'profile_image_url'>> = {};
    
    if (req.body.description !== undefined) updates.description = req.body.description;
    if (req.body.profile_image_url !== undefined) updates.profile_image_url = req.body.profile_image_url;

    if (Object.keys(updates).length === 0) {
      throw new ValidationError("No fields to update");
    }

    const viewer = await viewerService.update(
      req.body.userId,  // will be req.user.id after JWT
      req.params.viewerId,
      updates
    );

    res.status(200).json({ viewer });

  } catch (error) {
    next(error);
  }
}

export const ViewerGetById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {

    if(!req.params.viewerId) {
      throw new ValidationError("ViewerId required");
    }

    const viewer = await viewerService.getById(req.params.viewerId);

    res.status(200).json({ viewer });

  } catch(error) {
    next(error);
  }
}

export const ViewerGetMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {

    // TODO: After auth implementation, get userId from JWT token
    // const userId = req.user.id;
    
    if(!req.params.userId) {
      throw new ValidationError("UserId required");  // remove this after JWT implementation
    }

    const viewer = await viewerService.getMe(req.params.userId);

    res.status(200).json({ viewer })

  } catch (error) {
    next(error);
  }
}
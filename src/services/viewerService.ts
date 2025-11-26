// services/viewerService.ts

import { ViewerRepository } from '../repositories/viewerRepository';
import { UserBaseRepository } from '../repositories/userBaseRepository';

import { ViewerInsert } from '../types/models';
import { DuplicateError, NotFoundError, ValidationError } from '../errors/AppError';

export class ViewerService {
  private viewerRepo = new ViewerRepository();
  private userBaseRepo = new UserBaseRepository();

  async create(
    userId: string, 
    username: string, 
    description?: string, 
    profile_image_url?: string
  ) {
    const existingViewer = await this.viewerRepo.findByField('username', username, ['id']);
    if (existingViewer) {
      throw new DuplicateError("Username already taken");
    }

    const user = await this.userBaseRepo.findById(userId);
    if (!user) {
      throw new NotFoundError("User does not exist");
    }

    const newViewer: ViewerInsert = {
      user_id: userId,
      username,
      description,
      profile_image_url
    };

    return await this.viewerRepo.create(newViewer);
  }
}
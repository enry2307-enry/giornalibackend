// services/viewerService.ts
import bcrypt from 'bcrypt';

import { ViewerRepository } from '../repositories/viewerRepository';
import { UserBaseRepository } from '../repositories/userBaseRepository';

import { Viewer, ViewerInsert } from '../types/models';
import { DuplicateError, NotFoundError, ValidationError, ForbiddenError } from '../errors/AppError';

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

  async getByUsername(username: string): Promise<Viewer | null> {
    return await this.viewerRepo.getByUsername(username);
  }

  async getByUserId(userId: string): Promise<Viewer | null> {
    return await this.viewerRepo.getByUserId(userId);
  }

  async getById(viewerId: string): Promise<Viewer | null> {
    return await this.viewerRepo.findById(viewerId);
  }

  async update(
  userId: string, 
  viewerId: string,
  updates: Partial<Pick<Viewer, 'description' | 'profile_image_url'>>
  ) {
    const viewer = await this.viewerRepo.findById(viewerId);
    if (!viewer) {
      throw new NotFoundError("Viewer not found");
    }

    if (viewer.user_id !== userId) {
      throw new ForbiddenError("You don't have permission to update this viewer");
    }

    return await this.viewerRepo.update(viewerId, updates);
  }

  async softDelete(viewerId: string, userId: string, user_password: string): Promise<Viewer> {
    const user = await this.userBaseRepo.findById(userId);
    if(!user) {
      throw new NotFoundError("User not found");
    }

    const viewer = await this.viewerRepo.findById(viewerId);
    if(!viewer) {
      throw new NotFoundError("Viewer not found");
    }

    if (viewer.user_id !== userId) {
      throw new ForbiddenError("You don't have permission to delete this viewer");
    }

    const validPassword = await bcrypt.compare(user_password, user.password_hash);
    if (!validPassword) {
      throw new ValidationError("Wrong password");
    }

    await this.viewerRepo.softDelete(viewerId);

    return viewer;
  }
}
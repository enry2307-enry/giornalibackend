// services/userBaseService.ts
import { UserBaseRepository } from '../repositories/userBaseRepository';
import { DuplicateError, NotFoundError } from '../errors/AppError';

export class UserBaseService {
  private repo = new UserBaseRepository();

  async create(email: string, password: string) {
    const existing = await this.repo.findByEmail(email);
    if (existing) {
      throw new DuplicateError('Email already exists');
    }

    // Create user
  }

  async getById(id: string) {
    const user = await this.repo.findById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }
}
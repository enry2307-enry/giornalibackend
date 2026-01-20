// services/userBaseService.ts
import bcrypt from 'bcrypt';

import { UserBaseRepository } from '../repositories/userBaseRepository';
import { DuplicateError, NotFoundError, ValidationError } from '../errors/AppError';
import { UserBase, UserBaseInsert } from '../types/models'; 

export class UserBaseService {
  private repo = new UserBaseRepository();

  async create(email: string, password: string): Promise<UserBase> {

    const existing = await this.repo.findOneWhere({email: email});

    if (existing) {
      throw new DuplicateError('Email already exists');
    }

    const password_hash = await bcrypt.hash(password, 10);


    // Error Here
    const user: UserBaseInsert = {
      email,
      password_hash,
    };

    return await this.repo.create(user);
  }

  async getById(userId: string) {
    const user = await this.repo.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  async getByEmail(email: string) {
    const user = await this.repo.findOneWhere({email: email});
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  async softDelete(userId: string, password: string): Promise<void> {
    const user = await this.repo.findById(userId, {select: ['password_hash']});
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      throw new ValidationError('Invalid password');
    }

    await this.repo.softDelete(userId);
  }
}
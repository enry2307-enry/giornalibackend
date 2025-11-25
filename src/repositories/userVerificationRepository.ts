// repositories/userVerificationRepository.ts
import { UserVerification } from '../types/models';
import { BaseRepository } from './baseRepository';

export class UserVerificationRepository extends BaseRepository<UserVerification> {
  protected tableName = 'userverification';
}
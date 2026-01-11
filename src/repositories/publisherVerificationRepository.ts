// repositories/publisherVerificationRepository.ts
import { PublisherVerification } from '../types/models';
import { BaseRepository } from './baseRepository';

export class PublisherVerificationRepository extends BaseRepository<PublisherVerification> {
  protected tableName = 'publisherverification';
  protected defaultSelect = 'id,created_at';
}
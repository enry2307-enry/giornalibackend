// repositories/publisherRepository.ts
import { Publisher } from '../types/models';
import { BaseRepository } from './baseRepository';

export class PublisherRepository extends BaseRepository<Publisher> {
  protected tableName = 'publisher';
}
// repositories/publisherRepository.ts
import { Publisher } from '../types/models';
import { BaseRepository } from './baseRepository';

export class PublisherRepository extends BaseRepository<Publisher, Publisher> {
  protected tableName = 'publisher';
  protected defaultSelect = 'id,created_at';
}
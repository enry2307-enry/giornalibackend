// repositories/reportPublisherRepository.ts
import { ReportPublisher } from '../types/models';
import { BaseRepository } from './baseRepository';

export class ReportPublisherRepository extends BaseRepository<ReportPublisher> {
  protected tableName = 'reportpublisher';
  protected defaultSelect = 'id,created_at';
}
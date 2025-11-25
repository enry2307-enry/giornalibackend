// repositories/reportPostRepository.ts
import { ReportPost } from '../types/models';
import { BaseRepository } from './baseRepository';

export class ReportPostRepository extends BaseRepository<ReportPost> {
  protected tableName = 'reportpost';
}
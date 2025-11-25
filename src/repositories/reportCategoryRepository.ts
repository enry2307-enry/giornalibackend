// repositories/reportCategoryRepository.ts
import { ReportCategory } from '../types/models';
import { BaseRepository } from './baseRepository';

export class ReportCategoryRepository extends BaseRepository<ReportCategory> {
  protected tableName = 'reportcategory';
}
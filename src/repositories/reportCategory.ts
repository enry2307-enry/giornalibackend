// repositories/reportCategoryRepository.ts
import { ReportCategory } from '../types/models';
import { BaseRepository } from './baseRepository';

export class ReportCategoryRepository extends BaseRepository<ReportCategory, ReportCategory> {
  protected tableName = 'reportcategory';
  protected defaultSelect = 'id,created_at';
}
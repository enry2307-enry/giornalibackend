// repositories/reportScrollVideoRepository.ts
import { ReportScrollVideo } from '../types/models';
import { BaseRepository } from './baseRepository';

export class ReportScrollVideoRepository extends BaseRepository<ReportScrollVideo, ReportScrollVideo> {
  protected tableName = 'reportscrollvideo';
  protected defaultSelect = 'id,created_at';
}
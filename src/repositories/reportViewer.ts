// repositories/reportViewerRepository.ts
import { ReportViewer } from '../types/models';
import { BaseRepository } from './baseRepository';

export class ReportViewerRepository extends BaseRepository<ReportViewer, ReportViewer> {
  protected tableName = 'reportviewer';
  protected defaultSelect = 'id,created_at';
}
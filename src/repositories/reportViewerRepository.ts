// repositories/reportViewerRepository.ts
import { ReportViewer } from '../types/models';
import { BaseRepository } from './baseRepository';

export class ReportViewerRepository extends BaseRepository<ReportViewer> {
  protected tableName = 'reportviewer';
}
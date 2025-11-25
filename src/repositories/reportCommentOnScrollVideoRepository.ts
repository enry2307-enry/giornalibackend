// repositories/reportCommentOnScrollVideoRepository.ts
import { ReportCommentOnScrollVideo } from '../types/models';
import { BaseRepository } from './baseRepository';

export class ReportCommentOnScrollVideoRepository extends BaseRepository<ReportCommentOnScrollVideo> {
  protected tableName = 'reportcommentonscrollvideo';
}
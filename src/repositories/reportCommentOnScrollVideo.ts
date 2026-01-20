// repositories/reportCommentOnScrollVideoRepository.ts
import { ReportCommentOnScrollVideo } from '../types/models';
import { BaseRepository } from './baseRepository';

export class ReportCommentOnScrollVideoRepository extends BaseRepository<ReportCommentOnScrollVideo, ReportCommentOnScrollVideo> {
  protected tableName = 'reportcommentonscrollvideo';
  protected defaultSelect = 'id,created_at';
}
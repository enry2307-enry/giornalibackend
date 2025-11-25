// repositories/reportCommentOnPostRepository.ts
import { ReportCommentOnPost } from '../types/models';
import { BaseRepository } from './baseRepository';

export class ReportCommentOnPostRepository extends BaseRepository<ReportCommentOnPost> {
  protected tableName = 'reportcommentonpost';
}
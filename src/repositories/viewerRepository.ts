// repositories/viewerRepository.ts
import { Viewer } from '../types/models';
import { BaseRepository } from './baseRepository';

export class ViewerRepository extends BaseRepository<Viewer> {
  protected tableName = 'viewer';
}
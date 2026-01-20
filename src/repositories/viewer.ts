// repositories/viewerRepository.ts
import { Viewer, ViewerInsert } from '../types/models';
import { BaseRepository } from './baseRepository';

export class ViewerRepository extends BaseRepository<
  Viewer,
  ViewerInsert
> {
  protected tableName = 'viewers';
  protected defaultSelect = 'id,created_at';
}
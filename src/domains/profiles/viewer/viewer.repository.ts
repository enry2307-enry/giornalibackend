import { BaseRepository } from "../../../core/database/baseRepository";
import { Viewer, ViewerInsert, ViewerUpdate } from "../profiles.types";

class ViewerRepository extends BaseRepository<
  Viewer,
  ViewerInsert,
  ViewerUpdate
> {
  protected tableName: string = 'viewer';
}

export const viewerRepository = new ViewerRepository();
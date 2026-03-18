import { BaseRepository } from "../../../core/database/baseRepository";
import { Follow, FollowInsert, FollowUpdate } from "./follow.types";

class FollowRepository extends BaseRepository<
  Follow,
  FollowInsert,
  FollowUpdate
> {
  protected override tableName: string = 'follow';
}

export const followRepository = new FollowRepository();
import { BaseRepository } from "../../../core/database/baseRepository";
import { Like, LikeInsert, LikeUpdate } from "./like.types";

export class LikeRepository extends BaseRepository<
  Like,
  LikeInsert,
  LikeUpdate
> {
  protected override tableName: string;

  constructor(tableName: string) {
    super();
    this.tableName = tableName;
  }
}

export const likeOnPostRepository = new LikeRepository("likeonpost");
export const likeOnScrollVideoRepository = new LikeRepository("likeonscrollvideo");
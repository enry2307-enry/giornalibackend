import { BaseRepository } from "../../../core/database/baseRepository";
import { Comment, CommentInsert, CommentUpdate } from "./comment.types";

class CommentOnPostRepository extends BaseRepository<
  Comment,
  CommentInsert,
  CommentUpdate
> {
  protected override tableName: string = 'commentonpost';
}

class CommentOnScrollVideoRepository extends BaseRepository<
  Comment,
  CommentInsert,
  CommentUpdate
> {
  protected override tableName: string = 'commentonscrollvideo';
}

export const commentOnPostRepository = new CommentOnPostRepository();
export const commentOnScrollVideoRepository = new CommentOnScrollVideoRepository();
import { CommentStatus } from "../types/db_enums";

export default interface CommentOnPost {
  id: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  user_id: string; // FK UserBase
  post_id: string; // FK Post
  parent_comment_id: string | null; // FK CommentOnPost
  content: string;
  status: CommentStatus;
}
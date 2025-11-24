import { CommentStatus } from "../types/db_enums";

export default interface CommentOnScrollVideo {
  id: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  user_id: string; // FK UserBase
  scrollvideo_id: string; // FK ScrollVideo
  parent_comment_id: string | null; // FK CommentOnScrollVideo
  content: string;
  status: CommentStatus;
}
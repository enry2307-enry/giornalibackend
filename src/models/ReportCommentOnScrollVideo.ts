export default interface ReportCommentOnScrollVideo {
  id: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  user_id: string; // FK UserBase
  comment_id: string; // FK CommentOnScrollVideo
  description: string | null;
  category_id: string; // FK ReportCategory
}
export default interface ReportCommentOnPost {
  id: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  user_id: string; // FK UserBase
  comment_id: string; // FK CommentOnPost
  description: string | null;
  category_id: string; // FK ReportCategory
}
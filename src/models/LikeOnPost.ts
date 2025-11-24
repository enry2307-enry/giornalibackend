export default interface LikeOnPost {
  id: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  user_id: string; // FK UserBase
  post_id: string; // FK Post
}

export default interface LikeOnScrollVideo {
  id: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  user_id: string; // FK UserBase
  scrollvideo_id: string; // FK ScrollVideo
}
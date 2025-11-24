export default interface Viewer {
  id: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  user_id: string; // FK UserBase
  username: string;
  description: string | null;
  profile_image_url: string | null;
}
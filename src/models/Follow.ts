export default interface Follow {
  id: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  follow_user_id: string; // FK UserBase
  target_publisher_id: string;
}
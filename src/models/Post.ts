export default interface Post {
  id: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  publisher_id: string; // FK Publisher
  description: string | null;
  media_payload: Record<string, unknown> | null;
  attachments_payload: Record<string, unknown> | null;
  category_id: string; // FK Category
}
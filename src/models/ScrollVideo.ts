export default interface ScrollVideo {
  id: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  publisher_id: string; // FK Publisher
  description: string | null;
  video_url: string;
  attachments_payload: Record<string, unknown> | null;
  category_id: string; // FK Category
}
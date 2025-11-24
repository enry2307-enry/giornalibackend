export default interface ReportPublisher {
  id: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  user_id: string; // FK UserBase
  publisher_id: string; // FK Publisher
  description: string | null;
  category_id: string; // FK ReportCategory
}
export default interface ReportCategory {
  id: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  name: string;
  icon_url: string | null;
  parent_category_id: string | null; // FK ReportCategory
}
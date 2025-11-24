export default interface ReportViewer {
  id: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  user_id: string; // FK UserBase
  viewer_id: string; // FK Viewer
  description: string | null;
  category_id: string; // FK ReportCategory
}
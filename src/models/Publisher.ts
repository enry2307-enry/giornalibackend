import { PublisherType, PublisherStatus } from "../types/db_enums";

export default interface Publisher {
  id: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  user_id: string; // FK UserBase
  name: string;
  description: string | null;
  profile_image_url: string | null;
  website_url: string | null;
  status: PublisherStatus;
  type: PublisherType;
}
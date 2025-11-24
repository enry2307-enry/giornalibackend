import { 
  UserStatus,
  PublisherStatus,
  PublisherType,
  CommentStatus,
  PenaltyType,
  UserVerificationStatus,
  PublisherVerificationStatus
} from '../types/db_enums';

export interface UserBase {
  id: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  email: string;
  password_hash: string;
  status: UserStatus;
}

export interface Viewer {
  id: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  user_id: string;
  username: string;
  description: string | null;
  profile_image_url: string | null;
}

export interface Publisher {
  id: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  user_id: string;
  name: string;
  description: string | null;
  profile_image_url: string | null;
  external_url: string | null;
  status: PublisherStatus;
}

export interface Category {
  id: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  name: string;
  weight: number;
  type: PublisherType;
  icon_url: string | null;
  parent_category_id: string | null;
}

export interface Post {
  id: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  publisher_id: string;
  description: string | null;
  media: Record<string, unknown> | null;
  attachments: Record<string, unknown> | null;
  type: PublisherType;
  category_id: string;
}

export interface ScrollVideo {
  id: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  publisher_id: string;
  description: string | null;
  video_url: string;
  attachements: Record<string, unknown> | null;
  type: PublisherType;
  category_id: string;
}

export interface LikeOnPost {
  id: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  user_id: string;
  post_id: string;
}

export interface LikeOnScrollVideo {
  id: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  user_id: string;
  scrollvideo_id: string;
}

export interface CommentOnPost {
  id: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  user_id: string;
  post_id: string;
  parent_comment_id: string | null;
  content: string;
  status: CommentStatus;
}

export interface CommentOnScrollVideo {
  id: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  user_id: string;
  scrollvideo_id: string;
  parent_comment_id: string | null;
  content: string;
  status: CommentStatus;
}

export interface Follow {
  id: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  user_id: string;
  target_id: string;
}

export interface ReportCategory {
  id: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  name: string;
  icon_url: string | null;
  parent_category_id: string | null;
}

export interface ReportViewer {
  id: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  user_id: string;
  viewer_id: string;
  description: string | null;
  category_id: string;
}

export interface ReportPublisher {
  id: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  user_id: string;
  publisher_id: string;
  description: string | null;
  category_id: string;
}

export interface ReportCommentOnPost {
  id: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  user_id: string;
  comment_id: string;
  description: string | null;
  category_id: string;
}

export interface ReportCommentOnScrollVideo {
  id: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  user_id: string;
  comment_id: string;
  description: string | null;
  category_id: string;
}

export interface ReportScrollVideo {
  id: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  user_id: string;
  scrollvideo_id: string;
  description: string | null;
  category_id: string;
}

export interface ReportPost {
  id: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  user_id: string;
  post_id: string;
  description: string | null;
  category_id: string;
}

export interface Penalty {
  id: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  user_id: string;
  penalty_type: PenaltyType;
  days_of_penalty: number | null;
}

export interface UserVerification {
  id: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  user_id: string;
  code: string;
  expires_at: string;
  status: UserVerificationStatus;
}

export interface PublisherVerification {
  id: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  publisher_id: string;
  attachments: Record<string, unknown> | null;
  status: PublisherVerificationStatus;
  reason_of_failure: string;
}
import {
	UserStatus,
	PublisherStatus,
	PublisherType,
	CommentStatus,
	PenaltyType,
	UserVerificationStatus,
	PublisherVerificationStatus,
} from './db_enums';

export interface Category {
	id: string;
	created_at: string;
	updated_at: string;
	is_deleted: boolean;
	name: string;
	priority: number;
	icon_url: string | null;
	parent_category_id: string | null; // FK Category
}

export interface CommentOnPost {
	id: string;
	created_at: string;
	updated_at: string;
	is_deleted: boolean;
	user_id: string; // FK UserBase
	post_id: string; // FK Post
	parent_comment_id: string | null; // FK CommentOnPost
	content: string;
	status: CommentStatus;
}

export interface CommentOnScrollVideo {
	id: string;
	created_at: string;
	updated_at: string;
	is_deleted: boolean;
	user_id: string; // FK UserBase
	scrollvideo_id: string; // FK ScrollVideo
	parent_comment_id: string | null; // FK CommentOnScrollVideo
	content: string;
	status: CommentStatus;
}

export interface Follow {
	id: string;
	created_at: string;
	updated_at: string;
	is_deleted: boolean;
	follow_user_id: string; // FK UserBase
	target_publisher_id: string;
}

export interface LikeOnPost {
	id: string;
	created_at: string;
	updated_at: string;
	is_deleted: boolean;
	user_id: string; // FK UserBase
	post_id: string; // FK Post
}

export interface LikeOnScrollVideo {
	id: string;
	created_at: string;
	updated_at: string;
	is_deleted: boolean;
	user_id: string; // FK UserBase
	scrollvideo_id: string; // FK ScrollVideo
}

export interface Penalty {
	id: string;
	created_at: string;
	updated_at: string;
	is_deleted: boolean;
	user_id: string; // FK UserBase
	penalty_type: PenaltyType;
	days_of_penalty: number | null;
}

export interface Post {
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

export interface Publisher {
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

export interface PublisherVerification {
	id: string;
	created_at: string;
	updated_at: string;
	is_deleted: boolean;
	publisher_id: string; // FK Publisher
	attachments_payload: Record<string, unknown>;
	status: PublisherVerificationStatus;
	failure_reason: string | null;
}

export interface ReportCategory {
	id: string;
	created_at: string;
	updated_at: string;
	is_deleted: boolean;
	name: string;
	icon_url: string | null;
	parent_category_id: string | null; // FK ReportCategory
}

export interface ReportCommentOnPost {
	id: string;
	created_at: string;
	updated_at: string;
	is_deleted: boolean;
	user_id: string; // FK UserBase
	comment_id: string; // FK CommentOnPost
	description: string | null;
	category_id: string; // FK ReportCategory
}

export interface ReportCommentOnScrollVideo {
	id: string;
	created_at: string;
	updated_at: string;
	is_deleted: boolean;
	user_id: string; // FK UserBase
	comment_id: string; // FK CommentOnScrollVideo
	description: string | null;
	category_id: string; // FK ReportCategory
}

export interface ReportPost {
	id: string;
	created_at: string;
	updated_at: string;
	is_deleted: boolean;
	user_id: string; // FK UserBase
	post_id: string; // FK Post
	description: string | null;
	category_id: string; // FK ReportCategory
}

export interface ReportPublisher {
	id: string;
	created_at: string;
	updated_at: string;
	is_deleted: boolean;
	user_id: string; // FK UserBase
	publisher_id: string; // FK Publisher
	description: string | null;
	category_id: string; // FK ReportCategory
}

export interface ReportScrollVideo {
	id: string;
	created_at: string;
	updated_at: string;
	is_deleted: boolean;
	user_id: string; // FK UserBase
	scrollvideo_id: string; // FK ScrollVideo
	description: string | null;
	category_id: string; // FK ReportCategory
}

export interface ReportViewer {
	id: string;
	created_at: string;
	updated_at: string;
	is_deleted: boolean;
	user_id: string; // FK UserBase
	viewer_id: string; // FK Viewer
	description: string | null;
	category_id: string; // FK ReportCategory
}

export interface ScrollVideo {
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

export interface UserBase {
	id: string;
	created_at: string;
	updated_at: string;
	is_deleted: boolean;
	email: string;
	password_hash: string;
	status: UserStatus;
}
export type UserBaseInsert = Pick<UserBase, 'email' | 'password_hash'>;

export interface UserVerification {
	id: string;
	created_at: string;
	updated_at: string;
	is_deleted: boolean;
	user_id: string; // FK UserBase
	code: string;
	expires_at: string;
	status: UserVerificationStatus;
}

export interface Viewer {
	id: string;
	created_at: string;
	updated_at: string;
	is_deleted: boolean;
	user_id: string; // FK UserBase
	username: string;
	description: string | null;
	profile_image_url: string | null;
}


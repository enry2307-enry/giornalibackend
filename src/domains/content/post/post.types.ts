import { BaseAbstractEntity } from "../../../types/baseEntity";

export enum ContentStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  DRAFT = 'draft',
  INACTIVE = 'inactive'
}

export interface Post extends BaseAbstractEntity {
  publisher_id: string;
  category_id: string;
  status: ContentStatus;
  description: string;
}

export interface PostInsert extends Pick<Post, 'publisher_id' | 'category_id' | 'status'> {
  description?: string;
}

export interface PostUpdate extends Pick<
  Post,
  'status' | 'description'
> {}
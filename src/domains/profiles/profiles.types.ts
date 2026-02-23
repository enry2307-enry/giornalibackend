// src/domains/profile/profile.types.ts

import { BaseAbstractEntity } from "../../types/baseEntity";

export enum PublisherType {
  NEWSPAPER = 'newspaper',
  POPULARIZER = 'popularizer'
}

export enum PublisherStatus {
  VALID = 'valid',
  PENDING_SUBMISSION = 'pending_submission',
  PENDING_REVIEW = 'pending_review',
  INVALID = 'invalid',
  PENALTY = 'penalty'
}

export interface Publisher extends BaseAbstractEntity {
  user_id: string; // FK UserBase
  name: string;
  description: string | null;
  profile_image_url: string | null;
  website_url: string | null;
  status: PublisherStatus;
  type: PublisherType;
}
export type PublisherInsert = Pick<
  Publisher,
  'user_id' | 'name' | 'description' | 'profile_image_url' | 'website_url' | 'type'
>;
export type PublisherUpdate = Pick<
  Publisher,
  'description' | 'website_url' | 'profile_image_url'
>
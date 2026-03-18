import { BaseAbstractEntity } from "../../../types/baseEntity";

export interface Follow extends BaseAbstractEntity {
  follower_id: string;
  target_id: string;
  is_active: boolean;
}

export interface FollowInsert extends Pick<
  Follow,
  'follower_id' | 'target_id'
> {}

export interface FollowUpdate extends Pick<
  Follow,
  'is_active'
> {}
import { BaseAbstractEntity } from "../../../types/baseEntity";

export interface Like extends BaseAbstractEntity {
  user_id: string;
  entity_id: string;
  is_active: boolean;
}

export interface LikeInsert extends Pick<Like, 'user_id' | 'entity_id'> {}
export interface LikeUpdate extends Pick<Like, 'is_active'> {}


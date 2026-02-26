import { BaseAbstractEntity } from "../../types/baseEntity";

export enum UserStatus {
  ACTIVE = 'active',
  PENDING_EMAIL_VERIFICATION = 'pending_email_verification',
  INACTIVE = 'inactive',
  PENALTY = 'penalty'
}

export interface UserBase extends BaseAbstractEntity {
  email: string;
  password_hash: string;
  status: UserStatus;
  token_version: number;
}

export type UserBaseInsert = Pick<UserBase, 'email' | 'password_hash'>;
export type UserBaseUpdate = Pick<UserBase, 'password_hash' | 'token_version' | 'status'>;
export type PublicUser = Omit<UserBase, 'password_hash' | 'is_deleted'>;

export enum UserActionType {
  EMAIL_VERIFICATION = 'email_verification',
  PASSWORD_RESET = 'password_reset',
  EMAIL_CHANGE_RECOVERY = 'email_change_recovery'
}

export enum UserActionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  EXPIRED = 'expired',
  REVOKED = 'revoked'
}

export interface UserActionToken extends BaseAbstractEntity {
  user_id: string;
  code: string;
  type: UserActionType;
  status: UserActionStatus;
  expires_at: string;
}
export interface UserActionTokenInsert extends Pick<
  UserActionToken, 
  'user_id' | 'type'
> {}
export interface UserActionTokenUpdate extends Pick<
  UserActionToken, 
  'status' | 'expires_at'
> {}

export interface Session {
  user: PublicUser;
  accessToken: string;
  refreshToken: string;
}
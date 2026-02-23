import { BaseAbstractEntity } from "../../types/baseEntity";

export enum UserStatus {
  VALID = 'valid',
  PENDING_EMAIL_VERIFICATION = 'pending_email_verification',
  INACTIVE = 'inactive',
  PENALTY = 'penalty'
}

export interface UserBase extends BaseAbstractEntity {
  email: string;
  password_hash: string;
  status: UserStatus;
}

export type UserBaseInsert = Pick<UserBase, 'email' | 'password_hash'>;
export type PublicUser = Omit<UserBase, 'password_hash' | 'is_deleted'>;

export interface Session {
  user: PublicUser;
  accessToken: string;
  refreshToken: string;
}
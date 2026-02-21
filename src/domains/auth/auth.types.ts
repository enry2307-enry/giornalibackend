// src/domains/auth/auth.types.ts
import { BaseAbstractEntity } from "../../types/baseEntity";

export type UserStatus = 'valid' | 'pending_email_verification' | 'inactive' | 'penalty';

export interface UserBase extends BaseAbstractEntity {
  email: string;
  password_hash: string;
  status: UserStatus;
}

export type UserBaseInsert = Pick<UserBase, 'email' | 'password_hash' | 'status'>;
export type PublicUser = Omit<UserBase, 'password_hash' | 'is_deleted'>;

export interface Session {
  user: PublicUser;
  accessToken: string;
  refreshToken: string;
}
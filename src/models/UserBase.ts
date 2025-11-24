import { UserStatus } from '../types/db_enums';

export default interface UserBase {
  id: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  email: string;
  password_hash: string;
  status: UserStatus;
}

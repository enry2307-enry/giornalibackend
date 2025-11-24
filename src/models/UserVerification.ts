import { UserVerificationStatus } from "../types/db_enums";

export default interface UserVerification {
  id: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  user_id: string; // FK UserBase
  code: string;
  expires_at: string;
  status: UserVerificationStatus;
}
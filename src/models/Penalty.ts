import { PenaltyType } from "../types/db_enums";

export default interface Penalty {
  id: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  user_id: string; // FK UserBase
  penalty_type: PenaltyType;
  days_of_penalty: number | null;
}
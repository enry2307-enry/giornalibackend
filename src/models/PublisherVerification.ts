import { PublisherVerificationStatus } from "../types/db_enums";

export default interface PublisherVerification {
  id: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  publisher_id: string; // FK Publisher
  attachments_payload: Record<string, unknown>;
  status: PublisherVerificationStatus;
  failure_reason: string | null;
}

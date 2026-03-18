import { IsUUID } from "class-validator";

export class FollowToggleDTO {
  @IsUUID()
  target_id!: string;
}

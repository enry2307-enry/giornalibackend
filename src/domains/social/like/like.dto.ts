import { IsUUID } from "class-validator";


export class ToggleLikeDTO {
  @IsUUID()
  entity_id!: string;
}

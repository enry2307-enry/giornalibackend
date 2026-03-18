import { IsOptional, IsString, IsUUID, MaxLength, MinLength } from "class-validator";

class BaseComment {
  @MinLength(1)
  @MaxLength(255)
  @IsString()
  content!: string;
}

export class CommentCreateDTO extends BaseComment {
  @IsOptional()
  @IsUUID()
  parent_id?: string;
}

export class CommentEditDTO extends BaseComment {}
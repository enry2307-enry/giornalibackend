// src/domains/content/scroll-video/scroll-video.dto.ts
import { IsString, IsUUID, IsEnum, IsOptional, MaxLength } from 'class-validator';
import { ContentStatus } from '../post/post.types';

export class CreateScrollVideoDTO {
  @IsUUID()
  publisher_id!: string;

  @IsUUID()
  category_id!: string;

  @IsEnum([ContentStatus.ACTIVE, ContentStatus.DRAFT])
  status!: ContentStatus.ACTIVE | ContentStatus.DRAFT;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;
}

export class UpdateScrollVideoDTO {
  @IsOptional()
  @IsEnum([ContentStatus.ACTIVE, ContentStatus.DRAFT])
  status?: ContentStatus.ACTIVE | ContentStatus.DRAFT;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;
}
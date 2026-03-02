import { 
  IsString, 
  IsUUID, 
  IsEnum, 
  IsOptional, 
  MaxLength, 
  MinLength,
  ValidateIf,
  IsNotEmpty
} from 'class-validator';
import { ContentStatus } from './post.types';

type AllowedUserStatus = ContentStatus.ACTIVE | ContentStatus.DRAFT;

export class CreatePostDTO {
  @IsUUID()
  publisher_id!: string;

  @IsUUID()
  category_id!: string;

  @IsEnum([ContentStatus.ACTIVE, ContentStatus.DRAFT])
  status!: ContentStatus.ACTIVE | ContentStatus.DRAFT;

  /**
   * Logica: La descrizione è obbligatoria SOLO SE non ci sono file caricati.
   * Se i file sono presenti, la descrizione diventa opzionale.
   */
  @ValidateIf(o => !o.files || o.files.length === 0)
  @IsString()
  @IsOptional()
  @IsNotEmpty({ message: 'Description is required if no files are uploaded' })
  @MaxLength(2000)
  description?: string;

  /**
   * Campo per i file (popolato dal middleware tipo Multer)
   */
  @IsOptional()
  files?: any[]; 
}

/**
 * DTO per l'aggiornamento di un Post.
 */
export class UpdatePostDTO {
  @IsEnum({ active: ContentStatus.ACTIVE, draft: ContentStatus.DRAFT })
  status!: AllowedUserStatus;

  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(2000)
  description?: string;
}
import { 
  IsString, 
  MinLength, 
  MaxLength, 
  IsEnum, 
  IsOptional, 
  IsUrl 
} from "class-validator";
import { PublisherType } from "./profiles.types";

export class PublisherCreateDTO {
  @IsString()
  @MinLength(5, { message: 'Name length must be at least 5' })
  @MaxLength(15, { message: 'Name length must be maximum 15' })
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(PublisherType)
  type!: PublisherType;

  @IsOptional()
  @IsUrl()
  profile_image_url?: string;

  @IsOptional()
  @IsUrl()
  website_url?: string;
}
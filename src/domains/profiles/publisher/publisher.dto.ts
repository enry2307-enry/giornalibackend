import { 
  IsString, 
  MinLength, 
  MaxLength, 
  IsEnum, 
  IsOptional, 
  IsUrl 
} from "class-validator";
import { PublisherType } from "../profiles.types";
import { SecureOperationDTO } from "../../auth/auth.dto";

class PublisherBaseDTO {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  profile_image_url?: string;

  @IsOptional()
  @IsUrl()
  website_url?: string;
}

export class PublisherCreateDTO extends PublisherBaseDTO {
  @IsString()
  @MinLength(5)
  @MaxLength(15)
  name!: string;

  @IsEnum(PublisherType)
  type!: PublisherType;
}

export class PublisherDeleteDTO extends SecureOperationDTO {}

export class PublisherUpdateDTO extends PublisherBaseDTO {}
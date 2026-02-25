import { 
  IsString, 
  MinLength, 
  MaxLength, 
  IsOptional, 
  IsUrl 
} from "class-validator";
import { SecureOperationDTO } from "../../auth/auth.dto";

class ViewerBaseDTO {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  profile_image_url?: string;
}

export class ViewerCreateDTO extends ViewerBaseDTO {
  @IsString()
  @MinLength(5)
  @MaxLength(15)
  username!: string;
}

export class ViewerUpdateDTO extends ViewerBaseDTO {}

export class ViewerDeleteDTO extends SecureOperationDTO {}
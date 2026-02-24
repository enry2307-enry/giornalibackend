import { 
  IsString, 
  MinLength, 
  MaxLength, 
  IsOptional, 
  IsUrl 
} from "class-validator";

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

export class ViewerDeleteDTO {
  @IsString()
  @MinLength(5)
  @MaxLength(50)
  password!: string;
}
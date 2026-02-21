// domains/auth/auth.dto.ts
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDTO {
  @IsEmail({}, { message: 'Email address is not valid' })
  email!: string;

  @IsString()
  @MinLength(8, { message: 'Password must contain atleast 8 characters' })
  password!: string;
}

export class RegisterUserDTO extends LoginDTO {
  // In case we need to
}
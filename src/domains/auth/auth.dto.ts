// domains/auth/auth.dto.ts
import { IsEmail, IsString, Matches, MinLength } from 'class-validator';
import { AUTH_CONSTANTS } from '../../core/constants/auth.constants';

export class SecureOperationDTO {
  @IsString()
  @MinLength(AUTH_CONSTANTS.PASSWORD.MIN_LENGTH)
  @Matches(AUTH_CONSTANTS.PASSWORD.REGEX, { 
    message: AUTH_CONSTANTS.PASSWORD.ERROR_MESSAGE 
  })
  password!: string;
}

export class LoginDTO extends SecureOperationDTO {
  @IsEmail({}, { message: 'Email address is not valid' })
  email!: string;
}

export class RequestPasswordResetDTO {
  @IsEmail({}, { message: 'Email address is not valid' })
  email!: string;
}

export class RegisterUserDTO extends LoginDTO {
  // In case we need to
}

export class ResetPasswordDTO extends SecureOperationDTO {
  @IsString()
  code!: string;
}
// domains/auth/auth.dto.ts
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDTO {
  @IsEmail({}, { message: 'Inserisci un indirizzo email valido' })
  email!: string;

  @IsString()
  @MinLength(8, { message: 'La password deve contenere almeno 8 caratteri' })
  password!: string;
}

export class CreateUserDTO extends LoginDTO {
  // In case we need to
}
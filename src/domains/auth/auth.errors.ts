import { AUTH_CONSTANTS } from "../../core/constants/auth.constants";
import { AppError } from "../../errors/AppError";

export class UserNotFoundError extends AppError {
  constructor() {
    super(
      'User not found.',
      404,
      'USER_NOT_FOUND'
    )
  }
}


export class LoginFailedError extends AppError {
  constructor() {
    super(
      AUTH_CONSTANTS.LOGIN.ERROR_MESSAGE,
      401,
      'LOGIN_FAILED'
    );
  }
}

export class ActionTokenError extends AppError {
  constructor() {
    super(
      'Token invalid or expired.',
      404,
      'INVALID_TOKEN'
    )
  }
}

export class AuthenticationError extends AppError {
  constructor() {
    super(
      'Failed to authenticate.',
      401,
      'AUTHENTICATION_ERROR'
    )
  }
}

export class TokenVersionMismatchError extends AppError {
  constructor() {
    super(
      'Token version mismatch. Please login again.',
      401,
      'TOKEN_VERSION_MISMATCH'
    )
  }
}

export class TokenEmailVerificationError extends AppError {
  constructor() {
    super(
      'Verification token is invalid, expired or the email already verified.',
      404,
      'EMAIL_VERIFY_TOKEN_INVALID'
    )
  }
}
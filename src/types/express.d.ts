import { PublicUser } from '../domains/auth/auth.types';
import { ApiResponse } from '../core/types/api.types';
import { UserSession } from '../domains/auth/auth.types';

declare global {
  namespace Express {
    interface Request {
      user: UserSession
    }
    interface Response {
      json<T>(data: ApiResponse<T>): this;
    }
  }
}

export {};
import { PublicUser } from '../domains/auth/auth.types';
import { ApiResponse } from '../core/types/api.types';

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        token_version: string;
      };
    }
    interface Response {
      json<T>(data: ApiResponse<T>): this;
    }
  }
}

export {};
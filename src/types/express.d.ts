import { PublicUser } from '../domains/auth/auth.types';

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
      };
    }
  }
}

export {};
declare global {
  namespace Express {
    interface Request {
      user: import('../domains/auth/auth.types').UserSession;
    }
    interface Response {
      json<T>(data: import('../core/types/api.types').ApiResponse<T>): this;
    }
  }
}

export {};
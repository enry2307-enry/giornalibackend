// src/types/express.d.ts
import { ApiResponse } from "src/core/types/api.types";

declare global {
  namespace Express {
    interface Response {
      sendSuccess<T>(data: T, meta?: any): void;
    }
  }
}

export {};
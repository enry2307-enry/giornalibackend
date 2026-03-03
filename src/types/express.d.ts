// src/types/express.d.ts
import { ApiResponse } from "../core/types/api.types";

declare global {
  namespace Express {
    interface Response {
      sendSuccess<T>(ApiResponse): void;
    }
  }
}

export {};
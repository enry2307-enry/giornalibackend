export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;  
  message?: string;
  meta?: {
    warnings?: Array<{
      code: string;
      message: string;
      payload?: Record<string, unknown>;
    }>;
    count?: number;
    page?: number;
    limit?: number;
  };
}
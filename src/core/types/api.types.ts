export interface ApiResponse {
  status: 'success' | 'error' | 'warning';
  data?: any;
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
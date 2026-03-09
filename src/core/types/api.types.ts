export interface Warning {
  code: string;
  message: string;
  payload?: Record<string, unknown>;
}

export interface Meta {
  warnings?: Array<Warning>;
  count?: number;
  page?: number;
  limit?: number;
}

export type ApiStatus = 'success' | 'error' | 'warning'; 

export interface ApiResponse {
  status: ApiStatus;
  data?: any;
  message?: string;
  meta?: Meta;
}
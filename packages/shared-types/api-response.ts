export interface SuccessResponse<T = unknown> {
  success: true;
  message?: string;
  data?: T;
}

export interface ErrorResponse {
  success: false;
  code?: string;
  message?: string;
  details?: unknown;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  code?: string;
  details?: unknown;
}

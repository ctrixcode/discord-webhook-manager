export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  code?: string;
}

export interface ApiError {
  success: false;
  message: string;
  statusCode: number;
  errors?: any[];
  code?: string;
}

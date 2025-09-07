
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly errCode?: string;
  public readonly details?: unknown;

  constructor(message: string, statusCode: number, errCode?: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errCode = errCode;
    this.details = details;
    // Set the prototype explicitly to ensure instanceof works correctly in older environments
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
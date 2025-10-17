import { HttpStatusCode } from './httpcode';

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: string;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    errorCode: string,
    statusCode: number = HttpStatusCode.INTERNAL_SERVER_ERROR,
    isOperational = true
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

// For usage limit exceeded scenarios
export class UsageLimitExceededError extends ApiError {
  constructor(
    message: string,
    errorCode: 'WEBHOOK_LIMIT' | 'MEDIA_LIMIT',
    statusCode: number = HttpStatusCode.FORBIDDEN
  ) {
    super(message, errorCode, statusCode);
    this.name = 'UsageLimitExceededError';
  }
}

// For invalid input scenarios
export class InvalidInputError extends ApiError {
  public readonly details?: Record<string, unknown>;

  constructor(
    message: string,
    errorCode: string,
    details?: Record<string, unknown>,
    statusCode: number = HttpStatusCode.BAD_REQUEST
  ) {
    super(message, errorCode, statusCode);
    this.name = 'InvalidInputError';
    this.details = details;
  }
}

// For authentication failures
export class AuthenticationError extends ApiError {
  constructor(
    message: string,
    errorCode: string,
    statusCode: number = HttpStatusCode.UNAUTHORIZED
  ) {
    super(message, errorCode, statusCode);
    this.name = 'AuthenticationError';
  }
}

// For resource not found scenarios
export class NotFoundError extends ApiError {
  constructor(
    message: string,
    errorCode: string,
    statusCode: number = HttpStatusCode.NOT_FOUND
  ) {
    super(message, errorCode, statusCode);
    this.name = 'NotFoundError';
  }
}

// For internal server errors
export class InternalServerError extends ApiError {
  constructor(
    message: string,
    errorCode: string,
    statusCode: number = HttpStatusCode.INTERNAL_SERVER_ERROR
  ) {
    // Set isOperational to false for unexpected server errors
    super(message, errorCode, statusCode, false);
    this.name = 'InternalServerError';
  }
}

// For errors originating from external API calls
export class ExternalApiError extends ApiError {
  public readonly source?: string; // e.g., 'discord', 'cloudinary'

  constructor(
    message: string,
    errorCode: string,
    source?: 'google' | 'discord' | 'cloudinary',
    statusCode: number = HttpStatusCode.BAD_GATEWAY // 502 is often more appropriate for external failures
  ) {
    super(message, errorCode, statusCode);
    this.name = 'ExternalApiError';
    this.source = source;
  }
}

export class BadRequestError extends ApiError {
  constructor(
    message: string,
    errorCode: string,
    statusCode: number = HttpStatusCode.BAD_REQUEST
  ) {
    super(message, errorCode, statusCode);
    this.name = 'BadRequestError';
  }
}

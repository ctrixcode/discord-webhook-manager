import { HttpStatusCode } from './httpcode';

// Custom error class for usage limit exceeded scenarios
export class UsageLimitExceededError extends Error {
  statusCode: number;
  type: 'webhook_limit' | 'media_limit'; // To distinguish between types of usage limits

  constructor(
    message: string,
    type: 'webhook_limit' | 'media_limit',
    statusCode: number = HttpStatusCode.FORBIDDEN
  ) {
    super(message);
    this.name = 'UsageLimitExceededError';
    this.type = type;
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, UsageLimitExceededError.prototype);
  }
}

// Custom error class for invalid input scenarios
export class InvalidInputError extends Error {
  statusCode: number;
  details?: Record<string, unknown>;

  constructor(
    message: string,
    details?: Record<string, unknown>,
    statusCode: number = HttpStatusCode.BAD_REQUEST
  ) {
    super(message);
    this.name = 'InvalidInputError';
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, InvalidInputError.prototype);
  }
}

// Custom error class for authentication failures
export class AuthenticationError extends Error {
  statusCode: number;

  constructor(
    message: string,
    statusCode: number = HttpStatusCode.UNAUTHORIZED
  ) {
    super(message);
    this.name = 'AuthenticationError';
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

// Custom error class for resource not found scenarios
export class NotFoundError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = HttpStatusCode.NOT_FOUND) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

// Custom error class for internal server errors
export class InternalServerError extends Error {
  statusCode: number;

  constructor(
    message: string,
    statusCode: number = HttpStatusCode.INTERNAL_SERVER_ERROR
  ) {
    super(message);
    this.name = 'InternalServerError';
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}

// Custom error class for errors originating from external API calls
export class ExternalApiError extends Error {
  statusCode: number;
  source?: string; // e.g., 'discord', 'cloudinary'

  constructor(
    message: string,
    source?: string,
    statusCode: number = HttpStatusCode.INTERNAL_SERVER_ERROR
  ) {
    super(message);
    this.name = 'ExternalApiError';
    this.statusCode = statusCode;
    this.source = source;
    Object.setPrototypeOf(this, ExternalApiError.prototype);
  }
}

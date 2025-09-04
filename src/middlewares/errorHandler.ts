import fp from 'fastify-plugin';
import { logger } from '../utils';
import { HttpStatusCode } from '../utils/httpcode';
import { ErrorMessages } from '../utils/errorMessages';
import {
  UsageLimitExceededError,
  InvalidInputError,
  AuthenticationError,
  NotFoundError,
  InternalServerError,
  ExternalApiError,
} from '../utils/errors';
import { sendErrorResponse } from '../utils/responseHandler';

export default fp(async fastify => {
  fastify.setNotFoundHandler((request, reply) => {
    logger.warn(`Route not found: ${request.url}`);
    sendErrorResponse(
      reply,
      HttpStatusCode.NOT_FOUND,
      ErrorMessages.Generic.NOT_FOUND_ERROR.code,
      ErrorMessages.Generic.NOT_FOUND_ERROR.message,
      { path: request.url }
    );
  });

  fastify.setErrorHandler((error, request, reply) => {
    logger.error('Unhandled error:', error); // Log the entire error object

    let statusCode = HttpStatusCode.INTERNAL_SERVER_ERROR;
    let errorCode: string | undefined =
      ErrorMessages.Generic.INTERNAL_SERVER_ERROR.code;
    let message: string | undefined =
      ErrorMessages.Generic.INTERNAL_SERVER_ERROR.message;
    let details: unknown | undefined;

    if (error instanceof UsageLimitExceededError) {
      statusCode = error.statusCode;
      errorCode = error.type; // This is already a key-like string (e.g., 'webhook_limit')
      message = error.message;
    } else if (error instanceof InvalidInputError) {
      statusCode = error.statusCode;
      errorCode = ErrorMessages.Generic.INVALID_INPUT_ERROR.code;
      message = error.message;
      details = error.details;
    } else if (error instanceof AuthenticationError) {
      statusCode = error.statusCode;
      errorCode = ErrorMessages.Generic.AUTHENTICATION_ERROR.code;
      message = error.message;
    } else if (error instanceof NotFoundError) {
      statusCode = error.statusCode;
      errorCode = ErrorMessages.Generic.NOT_FOUND_ERROR.code;
      message = error.message;
    } else if (error instanceof ExternalApiError) {
      statusCode = error.statusCode;
      errorCode = ErrorMessages.Generic.EXTERNAL_API_ERROR.code;
      message = ErrorMessages.Generic.SOMETHING_WENT_WENT_ERROR.message;
      details = { source: error.source };
    } else if (error instanceof InternalServerError) {
      statusCode = error.statusCode;
      errorCode = ErrorMessages.Generic.INTERNAL_SERVER_ERROR.code;
      message = error.message;
    } else if (error instanceof Error) {
      message =
        process.env.NODE_ENV === 'development'
          ? error.message
          : ErrorMessages.Generic.INTERNAL_SERVER_ERROR.message;
      errorCode =
        error.code || ErrorMessages.Generic.INTERNAL_SERVER_ERROR.code;
    } else {
      // Fallback for non-Error objects
      message = ErrorMessages.Generic.INTERNAL_SERVER_ERROR.message;
      errorCode = ErrorMessages.Generic.INTERNAL_SERVER_ERROR.code;
    }

    // Ensure message is generic in production for unexpected errors
    if (
      process.env.NODE_ENV === 'production' &&
      !(
        error instanceof UsageLimitExceededError ||
        error instanceof InvalidInputError ||
        error instanceof AuthenticationError ||
        error instanceof NotFoundError ||
        error instanceof ExternalApiError
      )
    ) {
      message = ErrorMessages.Generic.SOMETHING_WENT_WENT_ERROR.message; // Use the most generic message for unhandled errors in production
      errorCode = ErrorMessages.Generic.INTERNAL_SERVER_ERROR.code; // Ensure generic code too
    }

    sendErrorResponse(reply, statusCode, errorCode, message, details);
  });
});

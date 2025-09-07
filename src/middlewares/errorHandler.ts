import fp from 'fastify-plugin';
import { logger } from '../utils';
import { HttpStatusCode } from '../utils/httpcode';
import { ErrorMessages } from '../utils/errorMessages';
import {
  InvalidInputError,
  NotFoundError,
  InternalServerError,
  ExternalApiError,
  ApiError,
} from '../utils/errors';
import { sendErrorResponse } from '../utils/responseHandler';
import { FastifyReply, FastifyRequest } from 'fastify';

export default fp(async fastify => {
  fastify.setNotFoundHandler((request, reply) => {
    logger.warn(`Route not found: ${request.url}`);
    const notFoundError = new NotFoundError(
      ErrorMessages.Generic.NOT_FOUND_ERROR.message,
      ErrorMessages.Generic.NOT_FOUND_ERROR.code,
      HttpStatusCode.NOT_FOUND
    );
    sendErrorResponse(
      reply,
      notFoundError.statusCode,
      notFoundError.errorCode,
      notFoundError.message,
      { path: request.url }
    );
  });

  fastify.setErrorHandler(
    (error: Error, request: FastifyRequest, reply: FastifyReply) => {
      let statusCode: number = HttpStatusCode.INTERNAL_SERVER_ERROR;
      let errorCode: string = ErrorMessages.Generic.INTERNAL_SERVER_ERROR.code;
      let message: string = ErrorMessages.Generic.INTERNAL_SERVER_ERROR.message;
      let details: unknown | undefined;

      // Use a type guard to check if the error is an instance of our custom ApiError
      if (error instanceof ApiError) {
        logger.warn(`Expected API Error: ${error.message}`, {
          errorCode: error.errorCode,
          statusCode: error.statusCode,
        }); // Log expected API errors as warnings
        statusCode = error.statusCode;
        errorCode = error.errorCode;
        message = error.message;

        if (error instanceof InvalidInputError) {
          details = error.details;
        } else if (error instanceof ExternalApiError) {
          details = { source: error.source };
          // For external API errors, we might want a more generic message in production
          if (process.env.NODE_ENV === 'production') {
            message = ErrorMessages.Generic.SOMETHING_WENT_WENT_ERROR.message;
          }
        }
        // For other ApiErrors (NotFoundError, AuthenticationError, UsageLimitExceededError),
        // message and errorCode are already set correctly from the ApiError base class.
      } else {
        logger.error('Unhandled error:', error.message); // Move logging here
        // This is the catch-all for unexpected, non-operational errors (bugs)
        // We create an InternalServerError to ensure a consistent response structure
        const internalError = new InternalServerError(
          ErrorMessages.Generic.INTERNAL_SERVER_ERROR.message,
          ErrorMessages.Generic.INTERNAL_SERVER_ERROR.code
        );
        statusCode = internalError.statusCode;
        errorCode = internalError.errorCode;
        message = internalError.message;

        // In production, always use a generic message for unexpected errors
        if (process.env.NODE_ENV === 'production') {
          message = ErrorMessages.Generic.SOMETHING_WENT_WENT_ERROR.message;
        }
      }

      sendErrorResponse(reply, statusCode, errorCode, message, details);
    }
  );
});

import { FastifyRequest, FastifyReply } from 'fastify';
import { verifyToken } from '../utils/jwt';
import { AuthenticationError, ApiError } from '../utils/errors'; // Import ApiError
import { ErrorMessages } from '../utils/errorMessages';
import { logger } from '../utils';
import { resetDailyWebhookLimit } from '../services/user-usage.service';

const authenticate = async (request: FastifyRequest, _reply: FastifyReply) => {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new AuthenticationError(
        ErrorMessages.Auth.NO_TOKEN_ERROR.message,
        ErrorMessages.Auth.NO_TOKEN_ERROR.code
      );
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new AuthenticationError(
        ErrorMessages.Auth.NO_TOKEN_ERROR.message,
        ErrorMessages.Auth.NO_TOKEN_ERROR.code
      );
    }

    const decoded = verifyToken(token);

    // reset daily webhook limit if new day
    await resetDailyWebhookLimit(decoded.userId);

    request.user = decoded;
  } catch (error) {
    if (error instanceof AuthenticationError) {
      // Check if it's an expected AuthenticationError
      logger.warn('Authentication warning:', error.message); // Log as warning
    } else if (error instanceof ApiError) {
      // Catch other custom API errors
      logger.warn('API Error in authenticate middleware:', error.message); // Log as warning
    } else {
      logger.error('Unexpected error in authenticate middleware:', error); // Log unexpected errors as error
    }
    throw error;
  }
};
export default authenticate;

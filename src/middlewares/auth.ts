import { FastifyRequest, FastifyReply } from 'fastify';
import { verifyToken } from '../utils/jwt';
import { AuthenticationError } from '../utils/errors';
import { ErrorMessages } from '../utils/errorMessages';
import { logger } from '../utils';

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
    request.user = decoded;
  } catch (error) {
    logger.error('Error in authenticate middleware:', error);
    throw error;
  }
};
export default authenticate;

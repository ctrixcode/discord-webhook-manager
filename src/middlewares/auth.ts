import { FastifyRequest, FastifyReply } from 'fastify';
import {
  verifyToken,
  generateAccessToken,
  generateRefreshToken,
} from '../utils/jwt';
import {
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} from '../utils/cookie';
import { logger } from '../utils';
import * as userService from '../services/user.service';

declare module 'fastify' {
  interface FastifyRequest {
    user?: { userId: string; email: string };
  }
}

const authenticate = async (
  request: FastifyRequest,
  reply: FastifyReply,
  done: () => void
) => {
  try {
    const token = request.cookies.accessToken; // Prioritize access token from cookie

    if (!token) {
      return reply
        .status(401)
        .send({ success: false, message: 'No token provided' });
    }

    try {
      const decoded = verifyToken(token);
      request.user = decoded;
      done();
    } catch (_error: unknown) {
      // Access token expired or invalid, try to use refresh token
      const refreshToken = request.cookies.refreshToken;

      if (!refreshToken) {
        clearRefreshTokenCookie(reply);
        return reply.status(401).send({
          success: false,
          message: 'Invalid or expired token, no refresh token',
        });
      }

      try {
        // If refresh token is valid, decode and get user
        const decodedRefreshToken = verifyToken(refreshToken);
        const user = await userService.getUserById(decodedRefreshToken.userId);

        if (!user) {
          clearRefreshTokenCookie(reply);
          return reply.status(401).send({
            success: false,
            message: 'Invalid refresh token: User not found',
          });
        }

        // Generate new access and refresh tokens
        const newAccessToken = generateAccessToken({
          userId: user.id,
          email: user.email,
        });
        const newRefreshToken = generateRefreshToken({
          userId: user.id,
          email: user.email,
        });

        setRefreshTokenCookie(reply, newRefreshToken);
        request.user = { userId: user.id, email: user.email };

        // Send new access token in response header for client to update
        reply.header('X-Access-Token', newAccessToken);
        done();
      } catch (refreshError: unknown) {
        clearRefreshTokenCookie(reply);
        logger.error(
          `Error refreshing token: ${(refreshError as Error).message}`
        );
        return reply.status(401).send({
          success: false,
          message: 'Invalid or expired refresh token',
        });
      }
    }
  } catch (error: unknown) {
    logger.error(
      `Authentication middleware error: ${(error as Error).message}`
    ); // Use template literal
    return reply
      .status(500)
      .send({ success: false, message: 'Internal server error' });
  }
};

export default authenticate;

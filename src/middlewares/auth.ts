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

export const authenticate = async (
  request: FastifyRequest,
  reply: FastifyReply,
  done: () => void
) => {
  try {
    let token = request.headers.authorization;

    if (!token || !token.startsWith('Bearer ')) {
      // Try to get token from cookies if not in headers (for refresh token flow)
      token = request.cookies.accessToken; // Assuming access token might also be in cookies
    }

    if (!token) {
      return reply
        .status(401)
        .send({ success: false, message: 'No token provided' });
    }

    const actualToken = token.replace('Bearer ', '');

    try {
      const decoded = verifyToken(actualToken);
      request.user = decoded; // Attach user payload to request
      done();
    } catch (error) {
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
      } catch (refreshError) {
        clearRefreshTokenCookie(reply);
        return reply.status(401).send({
          success: false,
          message: 'Invalid or expired refresh token',
        });
      }
    }
  } catch (error) {
    logger.error('Authentication middleware error:', error);
    return reply
      .status(500)
      .send({ success: false, message: 'Internal server error' });
  }
};

import { FastifyRequest, FastifyReply } from 'fastify';
import { TokenExpiredError } from 'jsonwebtoken';
import * as AuthService from '../services/auth.service';
import { setRefreshTokenCookie } from '../utils/cookie';
import { verifyToken } from '../utils/jwt';

const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return reply.status(401).send({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return reply.status(401).send({ message: 'No token provided' });
  }

  try {
    const decoded = verifyToken(token);
    request.user = decoded;
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      try {
        const refreshToken = request.cookies.refreshToken;
        if (!refreshToken) {
          return reply.status(401).send({
            message: 'Access token expired and no refresh token provided',
          });
        }

        const newTokens = await AuthService.refreshTokens(refreshToken);
        if (!newTokens) {
          return reply
            .status(401)
            .send({ message: 'Invalid or expired refresh token' });
        }

        const { newAccessToken, newRefreshToken } = newTokens;

        setRefreshTokenCookie(reply, newRefreshToken);
        reply.header('X-Access-Token', newAccessToken);

        const decoded = verifyToken(newAccessToken);
        request.user = decoded;
      } catch (_refreshError) {
        return reply.status(401).send({ message: 'Failed to refresh token' });
      }
    } else {
      return reply.status(401).send({ message: 'Invalid token' });
    }
  }
};
export default authenticate;

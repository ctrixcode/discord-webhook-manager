import { FastifyRequest, FastifyReply } from 'fastify';
import * as authService from '../services/auth.service';
import { logger } from '../utils';
import {
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} from '../utils/cookie';
import { CreateUserData } from '../services/user.service';

/**
 * Register a new user
 * POST /api/auth/register
 */
export const registerUser = async (
  request: FastifyRequest<{ Body: CreateUserData }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const { user, accessToken, refreshToken } = await authService.register(
      request.body
    );
    setRefreshTokenCookie(reply, refreshToken);
    reply.status(201).send({
      success: true,
      data: {
        user: { id: user.id, email: user.email, username: user.username },
        accessToken,
      },
      message: 'User registered successfully',
    });
  } catch (error: unknown) {
    logger.error('Error in registerUser controller:', error);
    if (error instanceof Error) {
      reply.status(400).send({
        success: false,
        message: error.message,
      });
    } else {
      reply.status(500).send({
        success: false,
        message: 'Internal server error',
      });
    }
  }
};

/**
 * Login a user
 * POST /api/auth/login
 */
export const loginUser = async (
  request: FastifyRequest<{ Body: Pick<CreateUserData, 'email' | 'password'> }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const { email, password } = request.body;
    if (!email || !password) {
      reply.status(400).send({
        success: false,
        message: 'Missing required fields: email, password',
      });
      return;
    }
    const { user, accessToken, refreshToken } = await authService.login(
      email,
      password
    );
    setRefreshTokenCookie(reply, refreshToken);
    reply.status(200).send({
      success: true,
      data: {
        user: { id: user.id, email: user.email, username: user.username },
        accessToken,
      },
      message: 'Logged in successfully',
    });
  } catch (error: unknown) {
    logger.error('Error in loginUser controller:', error);
    if (error instanceof Error) {
      reply.status(401).send({
        success: false,
        message: error.message,
      });
    } else {
      reply.status(500).send({
        success: false,
        message: 'Internal server error',
      });
    }
  }
};

/**
 * Refresh access token
 * POST /api/auth/refresh
 */
export const refreshAccessToken = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    const refreshToken = request.cookies.refreshToken;
    if (!refreshToken) {
      return reply
        .status(401)
        .send({ success: false, message: 'No refresh token provided' });
    }

    const { newAccessToken, newRefreshToken, user } =
      await authService.refreshTokens(refreshToken);
    setRefreshTokenCookie(reply, newRefreshToken);
    reply.status(200).send({
      success: true,
      data: {
        user: { id: user.id, email: user.email, username: user.username },
        accessToken: newAccessToken,
      },
      message: 'Access token refreshed successfully',
    });
  } catch (error: unknown) {
    logger.error('Error in refreshAccessToken controller:', error);
    clearRefreshTokenCookie(reply);
    if (error instanceof Error) {
      reply.status(401).send({
        success: false,
        message: error.message,
      });
    } else {
      reply.status(500).send({
        success: false,
        message: 'Internal server error',
      });
    }
  }
};

/**
 * Logout user
 * POST /api/auth/logout
 */
export const logoutUser = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    authService.logout(reply);
    reply
      .status(200)
      .send({ success: true, message: 'Logged out successfully' });
  } catch (error: unknown) {
    logger.error('Error in logoutUser controller:', error);
    reply
      .status(500)
      .send({ success: false, message: 'Internal server error' });
  }
};

import * as userService from './user.service';
import { hashPassword, comparePassword } from '../utils/auth';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from '../utils/jwt';
import { clearRefreshTokenCookie } from '../utils/cookie';
import { FastifyReply } from 'fastify';
import { logger } from '../utils';
import { CreateUserData } from './user.service';

export const register = async (userData: CreateUserData) => {
  const { email, password, username } = userData;

  if (!email || !password || !username) {
    throw new Error('Missing required fields: email, password, username');
  }

  const hashedPassword = await hashPassword(password);
  const user = await userService.createUser({
    email,
    password: hashedPassword,
    username,
  });

  const accessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
  });
  const refreshToken = generateRefreshToken({
    userId: user.id,
    email: user.email,
  });

  return { user, accessToken, refreshToken };
};

export const login = async (email: string, password: string) => {
  if (!email || !password) {
    throw new Error('Missing required fields: email, password');
  }

  const user = await userService.getUserByEmail(email);

  if (
    !user ||
    !user.password ||
    !(await comparePassword(password, user.password))
  ) {
    throw new Error('Invalid credentials');
  }

  const accessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
  });
  const refreshToken = generateRefreshToken({
    userId: user.id,
    email: user.email,
  });

  return { user, accessToken, refreshToken };
};

export const refreshTokens = async (refreshToken: string) => {
  try {
    const decodedRefreshToken = verifyToken(refreshToken);
    const user = await userService.getUserById(decodedRefreshToken.userId);

    if (!user) {
      throw new Error('Invalid refresh token: User not found');
    }

    const newAccessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
    });
    const newRefreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
    });

    return { newAccessToken, newRefreshToken, user };
  } catch (error) {
    logger.error('Error refreshing tokens:', error);
    throw new Error('Invalid or expired refresh token');
  }
};

export const logout = (reply: FastifyReply) => {
  clearRefreshTokenCookie(reply);
};

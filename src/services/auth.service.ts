import * as userService from './user.service';
import {
  generateAccessToken,
  generateRefreshToken,
  TokenPayload,
  verifyToken,
} from '../utils/jwt';
import { clearRefreshTokenCookie } from '../utils/cookie';
import { FastifyReply } from 'fastify';
import { logger } from '../utils';
import { getDiscordGuildIconURL } from '../utils/discord-api';
import AuthSessionTokenModel from '../models/AuthSessionToken';

export const loginWithDiscord = async (
  discordId: string,
  username: string,
  email: string,
  avatar: string,
  guilds: { id: string; name: string; icon: string | null }[]
) => {
  // Transform guild icons from ID to URL
  const transformedGuilds = guilds.map(guild => ({
    ...guild,
    icon: guild.icon ? getDiscordGuildIconURL(guild.id, guild.icon) : null,
  }));

  let user = await userService.getUserByDiscordId(discordId);

  if (!user) {
    // User does not exist, create a new one
    user = await userService.createUser({
      discord_id: discordId,
      username: username,
      email: email,
      discord_avatar: avatar,
      guilds: transformedGuilds,
    });
  } else {
    // User exists, update their information
    user = await userService.updateUser(user.id, {
      username: username,
      email: email,
      discord_avatar: avatar,
      guilds: transformedGuilds,
    });
  }

  if (!user) {
    throw new Error('Failed to create or update user with Discord info');
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

const revokeAllUserSessions = async (userId: string) => {
  await AuthSessionTokenModel.deleteMany({ userId: userId });
  logger.warn(`All sessions revoked for user: ${userId}`);
};

export const refreshTokens = async (refreshToken: string) => {
  try {
    const decodedRefreshToken = verifyToken(refreshToken) as TokenPayload;
    const user = await userService.getUserById(decodedRefreshToken.userId);

    if (!user) {
      throw new Error('Invalid refresh token: User not found');
    }

    // Check if the refresh token exists in our database and is not used
    const existingAuthSessionToken = await AuthSessionTokenModel.findOne({
      userId: decodedRefreshToken.userId,
      jti: decodedRefreshToken.jti,
    });

    if (!existingAuthSessionToken || existingAuthSessionToken.isUsed) {
      // If token is not found or already used, it's a potential compromise
      // Revoke all sessions for this user
      await revokeAllUserSessions(decodedRefreshToken.userId);
      throw new Error('Invalid or compromised refresh token');
    }

    // Mark the current refresh token as used
    existingAuthSessionToken.isUsed = true;
    await existingAuthSessionToken.save();

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
    // If the error is not already 'Invalid or compromised refresh token', then it's a generic JWT error
    if (error instanceof Error && error.message.includes('compromised')) {
      throw error; // Re-throw the specific error
    }
    throw new Error('Invalid or expired refresh token');
  }
};

export const logout = (reply: FastifyReply) => {
  clearRefreshTokenCookie(reply);
};

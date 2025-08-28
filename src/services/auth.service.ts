import * as userService from './user.service';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from '../utils/jwt';
import { clearRefreshTokenCookie } from '../utils/cookie';
import { FastifyReply } from 'fastify';
import { logger } from '../utils';
import { getDiscordGuildIconURL } from '../utils/discord-api';

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

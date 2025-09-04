import { logger } from '../utils';
import { getDiscordGuildIconURL } from '../utils/discord-api';
import AuthSessionTokenModel from '../models/AuthSessionToken';
import * as userService from './user.service';
import * as userUsageService from './user-usage.service'; // Import userUsageService
import {
  generateAccessToken,
  generateRefreshToken,
  TokenPayload,
  verifyToken,
} from '../utils/jwt';
import { AuthenticationError, InternalServerError } from '../utils/errors';
import { ErrorMessages } from '../utils/errorMessages';
import { HttpStatusCode } from '../utils/httpcode';

export const loginWithDiscord = async (
  discordId: string,
  username: string,
  email: string,
  avatar: string,
  guilds: { id: string; name: string; icon: string | null }[],
  userAgent: string
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
    throw new InternalServerError(
      ErrorMessages.Auth.FAILED_CREATE_UPDATE_USER_ERROR.message,
      ErrorMessages.Auth.FAILED_CREATE_UPDATE_USER_ERROR.code,
      HttpStatusCode.INTERNAL_SERVER_ERROR
    );
  }

  // Ensure UserUsage record exists for the user
  await userUsageService.getOrCreateUserUsage(user.id);

  const accessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
  });
  const { refreshToken } = generateRefreshToken(
    {
      userId: user.id,
      email: user.email,
    },
    userAgent
  );

  return { user, accessToken, refreshToken };
};

const revokeAllUserSessions = async (userId: string) => {
  await AuthSessionTokenModel.deleteMany({ userId: userId });
  logger.warn(`All sessions revoked for user: ${userId}`);
};

export const refreshTokens = async (
  refreshToken: string,
  currentUserAgent: string
) => {
  try {
    const decodedRefreshToken = verifyToken(refreshToken) as TokenPayload;
    const user = await userService.getUserById(decodedRefreshToken.userId);

    if (!user) {
      throw new InternalServerError(
        ErrorMessages.User.NOT_FOUND_ERROR.message,
        ErrorMessages.User.NOT_FOUND_ERROR.code,
        HttpStatusCode.NOT_FOUND
      );
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
      throw new AuthenticationError(
        ErrorMessages.Auth.INVALID_REFRESH_TOKEN_ERROR.message,
        ErrorMessages.Auth.INVALID_REFRESH_TOKEN_ERROR.code,
        HttpStatusCode.UNAUTHORIZED
      );
    }

    // Validate user agent
    if (existingAuthSessionToken.userAgent !== currentUserAgent) {
      await revokeAllUserSessions(decodedRefreshToken.userId);
      throw new AuthenticationError(
        ErrorMessages.Auth.INVALID_REFRESH_TOKEN_ERROR.message,
        ErrorMessages.Auth.INVALID_REFRESH_TOKEN_ERROR.code,
        HttpStatusCode.UNAUTHORIZED
      );
    }

    // Mark the current refresh token as used
    existingAuthSessionToken.isUsed = true;
    await existingAuthSessionToken.save();

    const newAccessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
    });
    const { refreshToken: newRefreshToken, jti: newRefreshTokenJti } =
      generateRefreshToken(
        {
          userId: user.id,
          email: user.email,
        },
        currentUserAgent
      );

    return { newAccessToken, newRefreshToken, user, newRefreshTokenJti };
  } catch (error) {
    logger.error('Error refreshing tokens:', error);
    // If the error is not already 'Invalid or compromised refresh token', then it's a generic JWT error
    if (
      error instanceof AuthenticationError ||
      error instanceof InternalServerError
    ) {
      throw error;
    }
    throw new AuthenticationError(
      ErrorMessages.Auth.INVALID_REFRESH_TOKEN_ERROR.message,
      ErrorMessages.Auth.INVALID_REFRESH_TOKEN_ERROR.code,
      HttpStatusCode.UNAUTHORIZED
    );
  }
};

export const logout = async (userId: string, refreshTokenJti: string) => {
  // Invalidate only the specific refresh token used for this session
  await AuthSessionTokenModel.findOneAndUpdate(
    { userId: userId, jti: refreshTokenJti },
    { isUsed: true }
  );
  logger.warn(`Session revoked for user: ${userId}, jti: ${refreshTokenJti}`);
};

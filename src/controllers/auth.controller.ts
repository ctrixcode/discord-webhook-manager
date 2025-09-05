import { ErrorMessages } from './../utils/errorMessages';
import { FastifyRequest, FastifyReply } from 'fastify';
import * as authService from '../services/auth.service';
import * as discordTokenService from '../services/discord-token.service';
import { logger } from '../utils';
import { verifyToken, TokenPayload } from '../utils/jwt';
import { sendSuccessResponse } from '../utils/responseHandler';
import { HttpStatusCode } from '../utils/httpcode';
import { BadRequestError, InternalServerError } from '../utils/errors';

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID as string;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET as string;
const DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI as string;

/**
 * Refresh access token
 * POST /api/auth/refresh
 */
export const refreshAccessToken = async (
  request: FastifyRequest<{ Body: { refreshToken: string } }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const { refreshToken } = request.body;
    if (!refreshToken) {
      return reply
        .status(401)
        .send({ success: false, message: 'No refresh token provided' });
    }

    const { newAccessToken, newRefreshToken } = await authService.refreshTokens(
      refreshToken,
      request.headers['user-agent'] || 'unknown'
    );

    sendSuccessResponse(
      reply,
      HttpStatusCode.OK,
      'Access token refreshed successfully',
      {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      }
    );
  } catch (error: unknown) {
    logger.error('Error in refreshAccessToken controller:', error);
    throw error;
  }
};

/**
 * Logout user
 * POST /api/auth/logout
 */
export const logoutUser = async (
  request: FastifyRequest<{ Body: { refreshToken: string } }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const { refreshToken } = request.body;

    if (refreshToken) {
      const decodedRefreshToken = verifyToken(refreshToken) as TokenPayload;
      if (decodedRefreshToken.userId && decodedRefreshToken.jti) {
        await authService.logout(
          decodedRefreshToken.userId,
          decodedRefreshToken.jti
        );
      } else {
        logger.warn('Logout request: Refresh token missing userId or jti.');
      }
    } else {
      logger.warn('Logout request received without refresh token.');
    }

    sendSuccessResponse(reply, HttpStatusCode.OK, 'Logged out successfully');
  } catch (error: unknown) {
    logger.error('Error in logoutUser controller:', error);
    throw error;
  }
};

/**
 * Redirects to Discord's OAuth2 authorization page.
 * GET /api/auth/discord
 */
export const discordLogin = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(DISCORD_REDIRECT_URI)}&response_type=code&scope=identify%20email%20guilds`;
    reply.redirect(discordAuthUrl);
  } catch (error: unknown) {
    logger.error('Error in discordLogin controller:', error);
    throw error;
  }
};

/**
 * Handles the Discord OAuth2 callback.
 * GET /api/auth/discord/callback
 */
export const discordCallback = async (
  request: FastifyRequest<{ Querystring: { code: string } }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const { code } = request.query;

    if (!code) {
      throw new BadRequestError(
        ErrorMessages.Auth.MISSING_CODE_ERROR.message,
        ErrorMessages.Auth.MISSING_CODE_ERROR.code
      );
    }

    // Exchange authorization code for Discord access token
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: DISCORD_CLIENT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: DISCORD_REDIRECT_URI,
        scope: 'identify email guilds',
      }).toString(),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      logger.error('Error exchanging Discord code for token:', errorData);
      throw new InternalServerError(
        ErrorMessages.Discord.FAILED_TOKEN_EXCHANGE_ERROR.message,
        ErrorMessages.Discord.FAILED_TOKEN_EXCHANGE_ERROR.code
      );
    }

    const { access_token, refresh_token, expires_in } =
      await tokenResponse.json();

    // Get Discord user info
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!userResponse.ok) {
      const errorData = await userResponse.json();
      logger.error('Error fetching Discord user info:', errorData);
      throw new InternalServerError(
        ErrorMessages.Discord.TOKEN_FETCH_ERROR.message,
        ErrorMessages.Discord.TOKEN_FETCH_ERROR.code
      );
    }

    const discordUser = await userResponse.json();

    // Get Discord user guilds
    const guildsResponse = await fetch(
      'https://discord.com/api/users/@me/guilds',
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    interface DiscordGuild {
      id: string;
      name: string;
      icon: string | null;
    }
    let discordGuilds: DiscordGuild[] = [];
    if (guildsResponse.ok) {
      discordGuilds = await guildsResponse.json();
    } else {
      logger.warn(
        'Could not fetch Discord user guilds:',
        await guildsResponse.json()
      );
    }

    const { user, accessToken, refreshToken } =
      await authService.loginWithDiscord(
        discordUser.id,
        discordUser.username,
        discordUser.email,
        discordUser.avatar,
        discordGuilds,
        request.headers['user-agent'] || 'unknown'
      );

    // Save or update Discord token in our database
    const existingDiscordToken =
      await discordTokenService.getDiscordTokenByUserId(user.id);
    if (existingDiscordToken) {
      await discordTokenService.updateDiscordToken(user.id, {
        access_token,
        refresh_token,
        expires_in,
      });
    } else {
      await discordTokenService.createDiscordToken({
        user_id: user.id,
        access_token,
        refresh_token,
        expires_in,
      });
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    reply.redirect(
      `${frontendUrl}/auth/callback?access_token=${accessToken}&refresh_token=${refreshToken}`
    );
  } catch (error: unknown) {
    logger.error('Error in discordCallback controller:', error);
    throw error;
  }
};

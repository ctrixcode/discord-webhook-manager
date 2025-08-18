import { FastifyRequest, FastifyReply } from 'fastify';
import * as authService from '../services/auth.service';
import * as discordTokenService from '../services/discord-token.service';
import { logger } from '../utils';
import {
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} from '../utils/cookie';

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID as string;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET as string;
const DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI as string;

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
    reply.status(500).send({
      success: false,
      message: 'Internal server error',
    });
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
      reply.status(400).send({
        success: false,
        message: 'Missing authorization code',
      });
      return;
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
      reply.status(400).send({
        success: false,
        message: 'Failed to exchange Discord code for token',
      });
      return;
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
      reply.status(400).send({
        success: false,
        message: 'Failed to fetch Discord user info',
      });
      return;
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
        discordGuilds
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

    setRefreshTokenCookie(reply, refreshToken);
    reply.redirect(`http://localhost:3000/auth/callback?token=${accessToken}`);
    // reply.status(200).send({
    //   success: true,
    //   data: {
    //     user: { id: user.id, email: user.email, username: user.username },
    //     accessToken,
    //   },
    //   message: 'Logged in with Discord successfully',
    // });
  } catch (error: unknown) {
    logger.error('Error in discordCallback controller:', error);
    if (error instanceof Error) {
      reply.status(500).send({
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

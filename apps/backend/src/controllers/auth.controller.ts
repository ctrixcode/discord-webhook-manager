import { ErrorMessages } from './../utils/errorMessages';
import { FastifyRequest, FastifyReply } from 'fastify';
import * as authService from '../services/auth.service';
import * as userService from '../services/user.service';
import * as discordTokenService from '../services/discord-token.service';
import { logger } from '../utils';
import { verifyToken, TokenPayload } from '../utils/jwt';
import { sendSuccessResponse } from '../utils/responseHandler';
import { HttpStatusCode } from '../utils/httpcode';
import {
  AuthenticationError,
  BadRequestError,
  ExternalApiError,
  InternalServerError,
} from '../utils/errors';

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID as string;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET as string;
const DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI as string;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;
const GOOGLE_OAUTH_REDIRECT_URI = process.env
  .GOOGLE_OAUTH_REDIRECT_URI as string;

/**
 * Refresh access token
 * POST /api/auth/refresh
 */
export const refreshAccessToken = async (
  request: FastifyRequest<{ Body: { refreshToken: string } }>,
  reply: FastifyReply
): Promise<void> => {
  const { refreshToken } = request.body;
  if (!refreshToken) {
    throw new AuthenticationError(
      ErrorMessages.Auth.NO_TOKEN_ERROR.message,
      ErrorMessages.Auth.NO_TOKEN_ERROR.code
    );
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
};

/**
 * Logout user
 * POST /api/auth/logout
 */
export const logoutUser = async (
  request: FastifyRequest<{ Body: { refreshToken: string } }>,
  reply: FastifyReply
): Promise<void> => {
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
    throw new AuthenticationError(
      ErrorMessages.Auth.NO_TOKEN_ERROR.message,
      ErrorMessages.Auth.NO_TOKEN_ERROR.code
    );
  }

  sendSuccessResponse(reply, HttpStatusCode.OK, 'Logged out successfully');
};

/**
 * Send email verification
 * POST /api/auth/email/send-verification
 */
export const sendEmailVerification = async (
  request: FastifyRequest<{
    Body: {
      email: string;
      password: string;
      displayName: string;
      username: string;
    };
  }>,
  reply: FastifyReply
): Promise<void> => {
  const { email, password, displayName, username } = request.body;

  if (!email || !password || !displayName || !username) {
    throw new BadRequestError(
      ErrorMessages.Auth.MISSING_SIGNUP_FIELDS_ERROR.message,
      ErrorMessages.Auth.MISSING_SIGNUP_FIELDS_ERROR.code
    );
  }

  await authService.sendEmailVerification(
    email,
    password,
    displayName,
    username
  );

  sendSuccessResponse(
    reply,
    HttpStatusCode.OK,
    'Verification email sent. Please check your inbox.'
  );
};

/**
 * Verify email
 * POST /api/auth/email/verify
 */
export const verifyEmail = async (
  request: FastifyRequest<{ Body: { token: string } }>,
  reply: FastifyReply
): Promise<void> => {
  const { token } = request.body;

  if (!token) {
    throw new BadRequestError(
      ErrorMessages.Auth.MISSING_VERIFICATION_TOKEN_ERROR.message,
      ErrorMessages.Auth.MISSING_VERIFICATION_TOKEN_ERROR.code
    );
  }

  const { accessToken, refreshToken } = await authService.verifyEmail(
    token,
    request.headers['user-agent'] || 'unknown'
  );

  sendSuccessResponse(reply, HttpStatusCode.OK, 'Email verified successfully', {
    accessToken,
    refreshToken,
  });
};

/** Email login
 * POST /api/auth/email/login
 */
export const emailLogin = async (
  request: FastifyRequest<{ Body: { email: string; password: string } }>,
  reply: FastifyReply
): Promise<void> => {
  const { email, password } = request.body;

  if (!email || !password) {
    throw new BadRequestError(
      ErrorMessages.Auth.MISSING_CREDENTIALS_ERROR.message,
      ErrorMessages.Auth.MISSING_CREDENTIALS_ERROR.code
    );
  }

  const { accessToken, refreshToken } = await authService.loginWithEmail(
    email,
    password,
    request.headers['user-agent'] || 'unknown'
  );

  sendSuccessResponse(reply, HttpStatusCode.OK, 'Login successful', {
    accessToken,
    refreshToken,
  });
};

/**
 * Redirects to Discord's OAuth2 authorization page.
 * GET /api/auth/discord
 * GET /api/auth/discord/link (for linking existing account)
 */
export const discordLogin = async (
  request: FastifyRequest<{ Querystring: { state?: string } }>,
  reply: FastifyReply
): Promise<void> => {
  // If state=link, user is trying to link their account
  const action = request.query.state || 'login';

  // Build state object with action and email (if linking)
  const stateObj: { action: string; email?: string } = { action };

  // For linking, get the email from the authenticated user
  if (action === 'link') {
    const userId = request.user?.userId;

    if (!userId) {
      throw new AuthenticationError(
        ErrorMessages.Auth.NO_TOKEN_ERROR.message,
        ErrorMessages.Auth.NO_TOKEN_ERROR.code
      );
    }

    // Get user's email from the database
    const user = await userService.getUserById(userId);

    if (!user) {
      throw new AuthenticationError(
        ErrorMessages.User.NOT_FOUND_ERROR.message,
        ErrorMessages.User.NOT_FOUND_ERROR.code
      );
    }

    stateObj.email = user.email;
  }

  // Encode state as JSON string
  const state = Buffer.from(JSON.stringify(stateObj)).toString('base64');

  // Build Discord OAuth URL with state parameter
  const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(DISCORD_REDIRECT_URI)}&response_type=code&scope=identify%20email%20guilds&state=${encodeURIComponent(state)}`;
  reply.redirect(discordAuthUrl);
};

/**
 * Handles the Discord OAuth2 callback.
 * GET /api/auth/discord/callback
 */
export const discordCallback = async (
  request: FastifyRequest<{ Querystring: { code: string; state?: string } }>,
  reply: FastifyReply
): Promise<void> => {
  const { code, state } = request.query;

  if (!code) {
    throw new BadRequestError(
      ErrorMessages.Auth.MISSING_CODE_ERROR.message,
      ErrorMessages.Auth.MISSING_CODE_ERROR.code
    );
  }

  // Decode state parameter
  let stateObj: { action: string; email?: string } = { action: 'login' };
  if (state) {
    try {
      const decodedState = Buffer.from(state, 'base64').toString('utf-8');
      stateObj = JSON.parse(decodedState);
    } catch (error) {
      logger.warn('Failed to decode state parameter:', error);
      // If we can't decode the state, treat it as a login (backward compatibility)
      stateObj = { action: state };
    }
  }

  const isLinking = stateObj.action === 'link';
  const expectedEmail = stateObj.email;

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
    throw new ExternalApiError(
      ErrorMessages.Discord.TOKEN_FETCH_ERROR.message,
      ErrorMessages.Discord.TOKEN_FETCH_ERROR.code,
      'discord'
    );
  }

  const discordUser = await userResponse.json();

  // Verify email match when linking
  if (isLinking && expectedEmail) {
    if (discordUser.email !== expectedEmail) {
      logger.warn(
        `Email mismatch when linking Discord account. Expected: ${expectedEmail}, Got: ${discordUser.email}`
      );
      throw new BadRequestError(
        ErrorMessages.Discord.EMAIL_MISMATCH_ERROR.message,
        ErrorMessages.Discord.EMAIL_MISMATCH_ERROR.code
      );
    }
  }

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

  let user, accessToken, refreshToken;

  if (isLinking) {
    // Linking: Add Discord to existing account
    const result = await authService.linkDiscordAccount(
      discordUser.id,
      discordUser.global_name || discordUser.username,
      discordUser.username,
      discordUser.email,
      discordUser.avatar,
      discordGuilds,
      request.headers['user-agent'] || 'unknown'
    );
    user = result.user;
    accessToken = result.accessToken;
    refreshToken = result.refreshToken;
  } else {
    // Login/Signup: Create new account or login
    const result = await authService.loginWithDiscord(
      discordUser.id,
      discordUser.global_name || discordUser.username,
      discordUser.username,
      discordUser.email,
      discordUser.avatar,
      discordGuilds,
      request.headers['user-agent'] || 'unknown'
    );
    user = result.user;
    accessToken = result.accessToken;
    refreshToken = result.refreshToken;
  }

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

  if (isLinking) {
    // Redirect to settings page after linking
    reply.redirect(`${frontendUrl}/dashboard/settings?discord_linked=true`);
  } else {
    // Redirect to auth callback for login
    reply.redirect(
      `${frontendUrl}/auth/callback?access_token=${accessToken}&refresh_token=${refreshToken}`
    );
  }
};

/**
 * Redirects to Googles's OAuth2 authorization page.
 * GET /api/auth/google
 */
export const googleLogin = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(GOOGLE_OAUTH_REDIRECT_URI)}&response_type=code&scope=openid%20email%20profile`;
  reply.redirect(googleAuthUrl);
};

/** Handles the Google OAuth2 callback.
 * GET /api/auth/google/callback
 */
export const googleCallback = async (
  request: FastifyRequest<{ Querystring: { code: string } }>,
  reply: FastifyReply
): Promise<void> => {
  const { code } = request.query;

  if (!code) {
    throw new BadRequestError(
      ErrorMessages.Auth.MISSING_CODE_ERROR.message,
      ErrorMessages.Auth.MISSING_CODE_ERROR.code
    );
  }

  // Exchange authorization code for Google access token
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code,
      redirect_uri: GOOGLE_OAUTH_REDIRECT_URI,
    }).toString(),
  });

  if (!tokenResponse.ok) {
    const errorData = await tokenResponse.json();
    logger.error('Error exchanging Google code for token:', errorData);
    throw new ExternalApiError(
      ErrorMessages.Google.FAILED_TOKEN_EXCHANGE_ERROR.message,
      ErrorMessages.Google.FAILED_TOKEN_EXCHANGE_ERROR.code,
      'google'
    );
  }

  const { access_token } = await tokenResponse.json();

  // Get Google user info
  const userResponse = await fetch(
    'https://www.googleapis.com/oauth2/v3/userinfo',
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );

  if (!userResponse.ok) {
    const errorData = await userResponse.json();
    logger.error('Error fetching Google user info:', errorData);
    throw new ExternalApiError(
      ErrorMessages.Google.TOKEN_FETCH_ERROR.message,
      ErrorMessages.Google.TOKEN_FETCH_ERROR.code,
      'google'
    );
  }

  const googleUser = await userResponse.json();

  const { accessToken, refreshToken } = await authService.loginWithGoogle(
    googleUser.sub,
    googleUser.email,
    googleUser.name,
    googleUser.picture,
    request.headers['user-agent'] || 'unknown'
  );

  reply.redirect(
    `${FRONTEND_URL}/auth/callback?access_token=${accessToken}&refresh_token=${refreshToken}`
  );
};

/**
 * Check if user has a password
 * GET /api/auth/password/check
 */
export const checkPassword = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  const userId = request.user?.userId;

  if (!userId) {
    throw new AuthenticationError(
      ErrorMessages.Auth.NO_TOKEN_ERROR.message,
      ErrorMessages.Auth.NO_TOKEN_ERROR.code
    );
  }

  const passwordInfo = await authService.checkUserHasPassword(userId);

  sendSuccessResponse(
    reply,
    HttpStatusCode.OK,
    'Password status retrieved successfully',
    passwordInfo
  );
};

/**
 * Change or create user password
 * POST /api/auth/password/change
 */
export const changePassword = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  const userId = request.user?.userId;

  if (!userId) {
    throw new AuthenticationError(
      ErrorMessages.Auth.NO_TOKEN_ERROR.message,
      ErrorMessages.Auth.NO_TOKEN_ERROR.code
    );
  }

  const body = request.body as {
    currentPassword?: string;
    newPassword: string;
  };
  const { currentPassword, newPassword } = body;

  if (!newPassword) {
    throw new BadRequestError(
      ErrorMessages.Auth.NEW_PASSWORD_REQUIRED.message,
      ErrorMessages.Auth.NEW_PASSWORD_REQUIRED.code
    );
  }

  const result = await authService.changePassword(
    userId,
    currentPassword,
    newPassword
  );

  sendSuccessResponse(reply, HttpStatusCode.OK, result.message, {});
};

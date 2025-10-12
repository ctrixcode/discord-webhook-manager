import { logger } from '../utils';
import { getDiscordGuildIconURL } from '../utils/discord-api';
import AuthSessionTokenModel from '../models/AuthSessionToken';
import EmailVerificationTokenModel from '../models/EmailVerificationToken';
import * as userService from './user.service';
import * as userUsageService from './user-usage.service'; // Import userUsageService
import * as emailService from './email.service';
import bcrypt from 'bcryptjs';
import { randomInt } from 'crypto';
import {
  generateAccessToken,
  generateRefreshToken,
  TokenPayload,
  verifyToken,
} from '../utils/jwt';

import {
  ApiError,
  AuthenticationError,
  InternalServerError,
  NotFoundError,
  BadRequestError,
} from '../utils/errors';
import { ErrorMessages } from '../utils/errorMessages';
import mongoose from 'mongoose';

/**
 * Generates a unique username by checking for collisions in the database
 * If the base username exists, appends a random 4-digit number and retries
 * @param baseUsername - The initial username to try
 * @returns A unique username that doesn't exist in the database
 */
const generateUniqueUsername = async (
  baseUsername: string
): Promise<string> => {
  let username = baseUsername;
  let isUnique = false;
  let attempts = 0;
  const MAX_ATTEMPTS = 100; // Prevent infinite loops

  while (!isUnique && attempts < MAX_ATTEMPTS) {
    const existingUser = await userService.getUserByUsername(username);

    if (!existingUser) {
      isUnique = true;
    } else {
      // Generate a cryptographically secure random 4-digit number and append to base username
      const randomSuffix = randomInt(1000, 10000);
      username = `${baseUsername}${randomSuffix}`;
      attempts++;
    }
  }

  if (attempts >= MAX_ATTEMPTS) {
    throw new InternalServerError(
      'Unable to generate unique username after multiple attempts',
      'USERNAME_GENERATION_FAILED'
    );
  }

  return username;
};

export const sendEmailVerification = async (
  email: string,
  password: string,
  displayName: string,
  username: string
) => {
  // Check if user already exists
  let user = await userService.getUserByEmail(email);
  if (user) {
    if (user.discord_id) {
      throw new BadRequestError(
        ErrorMessages.Auth.DISCORD_ACCOUNT_LOGIN_ERROR.message,
        ErrorMessages.Auth.DISCORD_ACCOUNT_LOGIN_ERROR.code
      );
    } else if (user.google_id) {
      throw new BadRequestError(
        ErrorMessages.Auth.GOOGLE_ACCOUNT_LOGIN_ERROR.message,
        ErrorMessages.Auth.GOOGLE_ACCOUNT_LOGIN_ERROR.code
      );
    } else {
      throw new BadRequestError(
        ErrorMessages.Auth.EMAIL_ALREADY_IN_USE_ERROR.message,
        ErrorMessages.Auth.EMAIL_ALREADY_IN_USE_ERROR.code
      );
    }
  }

  user = await userService.getUserByUsername(username);
  if (user) {
    throw new BadRequestError(
      ErrorMessages.Auth.USERNAME_ALREADY_IN_USE_ERROR.message,
      ErrorMessages.Auth.USERNAME_ALREADY_IN_USE_ERROR.code
    );
  }

  // Check if there's already a pending verification for this email
  const existingToken = await EmailVerificationTokenModel.findOne({
    email,
    isUsed: false,
    expiresAt: { $gt: new Date() },
  });
  // Hash the password before storing
  const hashedPassword = await bcrypt.hash(password, 10);

  if (
    existingToken &&
    existingToken.display_name === displayName &&
    existingToken.username === username &&
    (await bcrypt.compare(password, existingToken.password)) &&
    existingToken.expiresAt > new Date()
  ) {
    // Resend the same token
    await emailService.sendVerificationEmail(email, existingToken.token);
    logger.info(`Resending email verification to ${email}`);
    return { success: true, message: 'Verification email resent' };
  }

  // Create verification token with user data
  const verificationToken = await EmailVerificationTokenModel.create({
    email,
    password: hashedPassword,
    display_name: displayName,
    username,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  });

  // Send verification email
  await emailService.sendVerificationEmail(email, verificationToken.token);

  logger.info(`Email verification sent to ${email}`);
  return { success: true, message: 'Verification email sent' };
};

export const verifyEmail = async (token: string, userAgent: string) => {
  // Find the verification token (check if it exists first, regardless of isUsed status)
  const tokenRecord = await EmailVerificationTokenModel.findOne({ token });

  // Check if token exists
  if (!tokenRecord) {
    throw new InternalServerError(
      ErrorMessages.Auth.INVALID_VERIFICATION_TOKEN_ERROR.message,
      ErrorMessages.Auth.INVALID_VERIFICATION_TOKEN_ERROR.code
    );
  }

  // Check if token has already been used
  if (tokenRecord.isUsed) {
    throw new BadRequestError(
      ErrorMessages.Auth.VERIFICATION_TOKEN_ALREADY_USED_ERROR.message,
      ErrorMessages.Auth.VERIFICATION_TOKEN_ALREADY_USED_ERROR.code
    );
  }

  // Check if token has expired
  if (tokenRecord.expiresAt <= new Date()) {
    throw new InternalServerError(
      ErrorMessages.Auth.INVALID_VERIFICATION_TOKEN_ERROR.message,
      ErrorMessages.Auth.INVALID_VERIFICATION_TOKEN_ERROR.code
    );
  }

  const verificationToken = tokenRecord;

  // Check if user already exists (in case they verified elsewhere)
  let user = await userService.getUserByEmail(verificationToken.email);
  if (user) {
    // Mark token as used and return existing user
    verificationToken.isUsed = true;
    await verificationToken.save();

    throw new BadRequestError(
      ErrorMessages.Auth.EMAIL_ALREADY_IN_USE_ERROR.message,
      ErrorMessages.Auth.EMAIL_ALREADY_IN_USE_ERROR.code
    );
  }

  // Create the user with the stored data
  user = await userService.createUser(
    {
      email: verificationToken.email,
      password: verificationToken.password, // Already hashed
      display_name: verificationToken.display_name,
      username: verificationToken.username,
    },
    true
  ); // skipPasswordHash = true because password is already hashed

  if (!user) {
    throw new BadRequestError(
      ErrorMessages.Auth.FAILED_CREATE_UPDATE_USER_ERROR.message,
      ErrorMessages.Auth.FAILED_CREATE_UPDATE_USER_ERROR.code
    );
  }

  // Mark token as used
  verificationToken.isUsed = true;
  await verificationToken.save();

  // Ensure UserUsage record exists for the user
  await userUsageService.getOrCreateUserUsage(user.id);

  // Generate access and refresh tokens
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

  logger.info(`Email verified and user created: ${user.email}`);
  return { user, accessToken, refreshToken };
};

export const loginWithEmail = async (
  email: string,
  password: string,
  userAgent: string
) => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new NotFoundError(
      ErrorMessages.Auth.USER_NOT_FOUND_ERROR.message,
      ErrorMessages.Auth.USER_NOT_FOUND_ERROR.code
    );
  }

  if (!user.password) {
    if (user.discord_id) {
      throw new BadRequestError(
        ErrorMessages.Auth.DISCORD_ACCOUNT_LOGIN_ERROR.message,
        ErrorMessages.Auth.DISCORD_ACCOUNT_LOGIN_ERROR.code
      );
    } else if (user.google_id) {
      throw new BadRequestError(
        ErrorMessages.Auth.GOOGLE_ACCOUNT_LOGIN_ERROR.message,
        ErrorMessages.Auth.GOOGLE_ACCOUNT_LOGIN_ERROR.code
      );
    } else {
      throw new BadRequestError(
        ErrorMessages.Auth.FAILED_CREATE_UPDATE_USER_ERROR.message,
        ErrorMessages.Auth.FAILED_CREATE_UPDATE_USER_ERROR.code
      );
    }
  }

  const isPasswordValid = await userService.verifyUserPassword(user, password);
  if (!isPasswordValid) {
    throw new BadRequestError(
      ErrorMessages.Auth.INVALID_CREDENTIALS_ERROR.message,
      ErrorMessages.Auth.INVALID_CREDENTIALS_ERROR.code
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

export const loginWithDiscord = async (
  discordId: string,
  displayName: string,
  username: string,
  email: string,
  avatar: string,
  guilds: { id: string; name: string; icon: string | null }[],
  userAgent: string
) => {
  try {
    // Transform guild icons from ID to URL
    const transformedGuilds = guilds.map(guild => ({
      ...guild,
      icon: guild.icon ? getDiscordGuildIconURL(guild.id, guild.icon) : null,
    }));

    let user = await userService.getUserByEmail(email);

    if (!user) {
      // User does not exist, create a new one
      user = await userService.createUser({
        discord_id: discordId,
        display_name: displayName,
        username: username,
        email: email,
        discord_avatar: avatar,
        guilds: transformedGuilds,
      });
    } else {
      // User exists, update their information
      user = await userService.updateUser(user.id, {
        discord_id: discordId,
        display_name: displayName,
        username: username,
        discord_avatar: avatar,
        guilds: transformedGuilds,
      });
    }

    if (!user) {
      throw new InternalServerError(
        ErrorMessages.Auth.FAILED_CREATE_UPDATE_USER_ERROR.message,
        ErrorMessages.Auth.FAILED_CREATE_UPDATE_USER_ERROR.code
      );
    }

    // Ensure UserUsage record exists for the user
    // TODO: infuture we should remove it. seems redundant
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
  } catch (error) {
    if (error instanceof ApiError) {
      logger.warn('Warning in loginWithDiscord:', error.message); // Log as warning
      throw error;
    }
    logger.error('Unexpected error in loginWithDiscord:', error); // Log unexpected errors as error
    throw new InternalServerError(
      ErrorMessages.Auth.FAILED_CREATE_UPDATE_USER_ERROR.message,
      ErrorMessages.Auth.FAILED_CREATE_UPDATE_USER_ERROR.code
    );
  }
};

export const loginWithGoogle = async (
  googleId: string,
  email: string,
  fullName: string,
  avatar: string,
  userAgent: string
) => {
  try {
    if (!googleId || !email) {
      throw new BadRequestError(
        ErrorMessages.Google.MISSING_GOOGLE_ID_OR_EMAIL_ERROR.message,
        ErrorMessages.Google.MISSING_GOOGLE_ID_OR_EMAIL_ERROR.code
      );
    }
    let user = await userService.getUserByEmail(email);
    if (!user) {
      // User does not exist, create a new one
      const baseUsername = email.split('@')[0];
      if (!baseUsername || baseUsername.trim().length === 0) {
        throw new BadRequestError(
          ErrorMessages.Google.INVALID_EMAIL_FORMAT_ERROR.message,
          ErrorMessages.Google.INVALID_EMAIL_FORMAT_ERROR.code
        );
      }

      // Generate a unique username by checking for collisions
      const uniqueUsername = await generateUniqueUsername(baseUsername);

      user = await userService.createUser({
        google_id: googleId,
        email: email,
        display_name: fullName,
        google_avatar: avatar,
        username: uniqueUsername,
      });
    } else {
      // User exists, update their Google ID and avatar
      user = await userService.updateUser(user.id, {
        google_id: googleId,
        google_avatar: avatar,
      });
    }

    if (!user) {
      throw new InternalServerError(
        ErrorMessages.Auth.FAILED_CREATE_UPDATE_USER_ERROR.message,
        ErrorMessages.Auth.FAILED_CREATE_UPDATE_USER_ERROR.code
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
  } catch (error) {
    if (error instanceof ApiError) {
      logger.warn('Warning in loginWithGoogle:', error.message);
      throw error;
    }
    logger.error('Unexpected error in loginWithGoogle:', error);
    throw new InternalServerError(
      ErrorMessages.Auth.FAILED_CREATE_UPDATE_USER_ERROR.message,
      ErrorMessages.Auth.FAILED_CREATE_UPDATE_USER_ERROR.code
    );
  }
};

const revokeAllUserSessions = async (userId: string) => {
  try {
    await AuthSessionTokenModel.deleteMany({ userId: userId });
    logger.warn(`All sessions revoked for user: ${userId}`);
  } catch (error) {
    logger.error('Error revoking user sessions:', error);
  }
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
        ErrorMessages.User.NOT_FOUND_ERROR.code
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
        ErrorMessages.Auth.INVALID_TOKEN_ERROR.message,
        ErrorMessages.Auth.INVALID_TOKEN_ERROR.code
      );
    }

    // Validate user agent
    if (existingAuthSessionToken.userAgent !== currentUserAgent) {
      await revokeAllUserSessions(decodedRefreshToken.userId);
      throw new AuthenticationError(
        ErrorMessages.Auth.INVALID_TOKEN_ERROR.message,
        ErrorMessages.Auth.INVALID_TOKEN_ERROR.code
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
    logger.error('Unexpected error refreshing tokens:', error); // Log unexpected errors as error
    if (error instanceof ApiError) {
      logger.warn('Warning refreshing tokens:', error.message); // Log as warning
      throw error;
    }
    throw new AuthenticationError(
      ErrorMessages.Auth.INVALID_TOKEN_ERROR.message,
      ErrorMessages.Auth.INVALID_TOKEN_ERROR.code
    );
  }
};

export const logout = async (userId: string, refreshTokenJti: string) => {
  try {
    await AuthSessionTokenModel.findOneAndUpdate(
      { userId: userId, jti: refreshTokenJti },
      { isUsed: true }
    );
    logger.warn(`Session revoked for user: ${userId}, jti: ${refreshTokenJti}`);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      logger.error('Cast error updating avatar:', error);
      throw new NotFoundError(
        ErrorMessages.User.NOT_FOUND_ERROR.message,
        ErrorMessages.User.NOT_FOUND_ERROR.code
      );
    }
    logger.error('Error in logout:', error);
    throw new InternalServerError(
      ErrorMessages.Generic.INTERNAL_SERVER_ERROR.message,
      ErrorMessages.Generic.INTERNAL_SERVER_ERROR.code
    );
  }
};

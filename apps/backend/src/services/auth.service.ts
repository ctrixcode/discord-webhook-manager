import { logger } from '../utils';
import { getDiscordGuildIconURL } from '../utils/discord-api';
import { hashPassword, comparePassword } from '../utils/auth';
import AuthSessionTokenModel from '../models/AuthSessionToken';
import EmailVerificationTokenModel from '../models/EmailVerificationToken';
import UserModel from '../models/User';
import * as userService from './user.service';
import * as userUsageService from './user-usage.service'; // Import userUsageService
import * as emailService from './email.service';
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
 * Uses batch checking to minimize database queries
 * @param baseUsername - The initial username to try
 * @returns A unique username that doesn't exist in the database
 */
const generateUniqueUsername = async (
  baseUsername: string
): Promise<string> => {
  // Sanitize and validate base username
  const sanitized = baseUsername
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '') // Remove invalid characters
    .slice(0, 15); // Leave room for suffix

  if (!sanitized || sanitized.length < 2) {
    throw new BadRequestError(
      'Invalid username base. Must be at least 2 alphanumeric characters.',
      'INVALID_USERNAME_BASE'
    );
  }

  // First try: Check if base username is available (most common case)
  const existingUser = await userService.getUserByUsername(sanitized);
  if (!existingUser) {
    return sanitized;
  }

  // Second try: Batch check multiple candidates to reduce DB queries
  const batchSize = 50;
  const candidates: string[] = [];

  for (let i = 1; i <= batchSize; i++) {
    candidates.push(`${sanitized}_${i}`);
  }

  // Use $in operator to check all candidates in a single query
  const existingUsernames = await UserModel.find({
    username: { $in: candidates },
  })
    .select('username')
    .lean();

  const existingSet = new Set(existingUsernames.map((u: any) => u.username));
  const availableUsername = candidates.find(c => !existingSet.has(c));

  if (availableUsername) {
    return availableUsername;
  }

  // Third try: If all numeric suffixes taken, use timestamp + random for guaranteed uniqueness
  const timestamp = Date.now().toString(36).slice(-4); // Last 4 chars of base36 timestamp
  const random = randomInt(100, 1000); // 3-digit random number
  const uniqueUsername = `${sanitized.slice(0, 10)}_${timestamp}${random}`;

  logger.info(
    `Generated unique username with timestamp: ${uniqueUsername} for base: ${baseUsername}`
  );
  return uniqueUsername;
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
        ErrorMessages.Auth.EMAIL_ALREADY_LINKED_DISCORD_ERROR.message,
        ErrorMessages.Auth.EMAIL_ALREADY_LINKED_DISCORD_ERROR.code
      );
    } else if (user.google_id) {
      throw new BadRequestError(
        ErrorMessages.Auth.EMAIL_ALREADY_LINKED_GOOGLE_ERROR.message,
        ErrorMessages.Auth.EMAIL_ALREADY_LINKED_GOOGLE_ERROR.code
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

  if (
    existingToken &&
    existingToken.display_name === displayName &&
    existingToken.username === username &&
    (await comparePassword(password, existingToken.password)) && // ✅ FIXED: Compare plain password with stored hash
    existingToken.expiresAt > new Date()
  ) {
    // Resend the same token
    logger.info(`Resending email verification to ${email}`);
    await emailService.sendVerificationEmail(email, existingToken.token);
    return { success: true, message: 'Verification email resent' };
  }

  // Hash the password only when creating new token (moved here for efficiency)
  const hashedPassword = await hashPassword(password);

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
    throw new BadRequestError(
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
    throw new BadRequestError(
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
  user = await userService.createUser({
    email: verificationToken.email,
    password: verificationToken.password, // Already hashed
    display_name: verificationToken.display_name,
    username: verificationToken.username,
  });

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
  return { accessToken, refreshToken };
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
        ErrorMessages.Auth.EMAIL_ALREADY_LINKED_DISCORD_ERROR.message,
        ErrorMessages.Auth.EMAIL_ALREADY_LINKED_DISCORD_ERROR.code
      );
    } else if (user.google_id) {
      throw new BadRequestError(
        ErrorMessages.Auth.EMAIL_ALREADY_LINKED_GOOGLE_ERROR.message,
        ErrorMessages.Auth.EMAIL_ALREADY_LINKED_GOOGLE_ERROR.code
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

  return { accessToken, refreshToken };
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
      if (!user.discord_id) {
        if (user.google_id) {
          throw new BadRequestError(
            ErrorMessages.Discord.EMAIL_ALREADY_LINKED_GOOGLE_ERROR.message,
            ErrorMessages.Discord.EMAIL_ALREADY_LINKED_GOOGLE_ERROR.code
          );
        } else {
          throw new BadRequestError(
            ErrorMessages.Discord.EMAIL_ALREADY_LINKED_ERROR.message,
            ErrorMessages.Discord.EMAIL_ALREADY_LINKED_ERROR.code
          );
        }
      }
      // Update user info with Discord details
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

/**
 * Link Discord account to existing user (from settings page)
 * This is called when user clicks "Link Discord Account" from settings
 */
export const linkDiscordAccount = async (
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

    // Find user by email
    const user = await userService.getUserByEmail(email);

    if (!user) {
      throw new NotFoundError(
        ErrorMessages.Discord.ACCOUNT_NOT_FOUND_ERROR.message,
        ErrorMessages.Discord.ACCOUNT_NOT_FOUND_ERROR.code
      );
    }

    // Check if Discord account is already linked to this user
    if (user.discord_id) {
      throw new BadRequestError(
        ErrorMessages.Discord.ALREADY_LINKED_ERROR.message,
        ErrorMessages.Discord.ALREADY_LINKED_ERROR.code
      );
    }

    // Check if this Discord account is linked to another user
    const existingUserWithDiscord =
      await userService.getUserByDiscordId(discordId);
    if (existingUserWithDiscord) {
      throw new BadRequestError(
        ErrorMessages.Discord.LINKED_TO_ANOTHER_ACCOUNT_ERROR.message,
        ErrorMessages.Discord.LINKED_TO_ANOTHER_ACCOUNT_ERROR.code
      );
    }

    // Update user with Discord info
    const updatedUser = await userService.updateUser(user.id, {
      display_name: displayName,
      username: username,
      discord_id: discordId,
      discord_avatar: avatar,
      guilds: transformedGuilds,
    });

    if (!updatedUser) {
      throw new InternalServerError(
        ErrorMessages.Auth.FAILED_CREATE_UPDATE_USER_ERROR.message,
        ErrorMessages.Auth.FAILED_CREATE_UPDATE_USER_ERROR.code
      );
    }

    // Generate new tokens for the user
    const accessToken = generateAccessToken({
      userId: updatedUser.id,
      email: updatedUser.email,
    });
    const { refreshToken } = generateRefreshToken(
      {
        userId: updatedUser.id,
        email: updatedUser.email,
      },
      userAgent
    );

    logger.info(`Discord account linked for user: ${updatedUser.id}`);
    return { user: updatedUser, accessToken, refreshToken };
  } catch (error) {
    if (error instanceof ApiError) {
      logger.warn('Warning in linkDiscordAccount:', error.message);
      throw error;
    }
    logger.error('Unexpected error in linkDiscordAccount:', error);
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
      if (!user.google_id) {
        if (user.discord_id) {
          throw new BadRequestError(
            ErrorMessages.Google.EMAIL_ALREADY_LINKED_DISCORD_ERROR.message,
            ErrorMessages.Google.EMAIL_ALREADY_LINKED_DISCORD_ERROR.code
          );
        } else {
          throw new BadRequestError(
            ErrorMessages.Google.EMAIL_ALREADY_LINKED_ERROR.message,
            ErrorMessages.Google.EMAIL_ALREADY_LINKED_ERROR.code
          );
        }
      }
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
    logger.error('Cast error during logout:', error);
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

/**
 * Check if user has a password set
 */
export const checkUserHasPassword = async (userId: string) => {
  try {
    const user = await userService.getUserById(userId);

    if (!user) {
      throw new NotFoundError(
        ErrorMessages.User.NOT_FOUND_ERROR.message,
        ErrorMessages.User.NOT_FOUND_ERROR.code
      );
    }

    return {
      hasPassword: !!user.password,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    logger.error('Error checking user password:', error);
    throw new InternalServerError(
      ErrorMessages.Generic.INTERNAL_SERVER_ERROR.message,
      ErrorMessages.Generic.INTERNAL_SERVER_ERROR.code
    );
  }
};

/**
 * Change or create user password
 */
export const changePassword = async (
  userId: string,
  currentPassword: string | undefined,
  newPassword: string
) => {
  try {
    const user = await userService.getUserById(userId);

    if (!user) {
      throw new NotFoundError(
        ErrorMessages.User.NOT_FOUND_ERROR.message,
        ErrorMessages.User.NOT_FOUND_ERROR.code
      );
    }
    const hadPassword = !!user.password;

    // If user already has a password, verify the current password
    if (user.password) {
      if (!currentPassword) {
        throw new BadRequestError(
          ErrorMessages.Auth.CURRENT_PASSWORD_REQUIRED.message,
          ErrorMessages.Auth.CURRENT_PASSWORD_REQUIRED.code
        );
      }

      const isPasswordValid = await userService.verifyUserPassword(
        user,
        currentPassword
      );

      if (!isPasswordValid) {
        throw new BadRequestError(
          ErrorMessages.Auth.INVALID_CURRENT_PASSWORD.message,
          ErrorMessages.Auth.INVALID_CURRENT_PASSWORD.code
        );
      }
    }

    // Update the password
    const hashedPassword = await hashPassword(newPassword);
    await userService.updateUser(userId, { password: hashedPassword });

    // Revoke all sessions to force re-login
    await revokeAllUserSessions(userId);

    logger.info(
      `Password ${hadPassword ? 'changed' : 'created'} for user: ${userId}`
    );

    return {
      success: true,
      message: hadPassword
        ? 'Password changed successfully'
        : 'Password created successfully',
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    logger.error('Error changing password:', error);
    throw new InternalServerError(
      ErrorMessages.Generic.INTERNAL_SERVER_ERROR.message,
      ErrorMessages.Generic.INTERNAL_SERVER_ERROR.code
    );
  }
};

import { BadRequestError, InternalServerError } from './../utils/errors';
import UserUsage, { IUserUsage } from '../models/UserUsage';
import User from '../models/User'; // Import User model
import { logger } from '../utils';
import {
  FREE_PLAN_DAILY_WEBHOOK_MESSAGE_LIMIT,
  DEFAULT_MEDIA_STORAGE_LIMIT_BYTES,
  PAID_PLAN_DAILY_WEBHOOK_MESSAGE_LIMIT,
  PAID_PLAN_MEDIA_STORAGE_LIMIT_BYTES,
  PREMIUM_PLAN_DAILY_WEBHOOK_MESSAGE_LIMIT,
  PREMIUM_PLAN_MEDIA_STORAGE_LIMIT_BYTES,
} from '../config/usage';
import { ErrorMessages } from '../utils/errorMessages';

/**
 * Retrieves a user's usage record by userId.
 * If no record exists, it creates a new one.
 * @param userId The ID of the user.
 * @returns The user's usage record.
 */
export const getOrCreateUserUsage = async (
  userId: string
): Promise<IUserUsage> => {
  try {
    let userUsage = await UserUsage.findOne({ userId });
    if (!userUsage) {
      userUsage = await UserUsage.create({ userId });
      logger.info(`Created new UserUsage record for user: ${userId}`);
    }
    return userUsage;
  } catch (error) {
    logger.error(
      `Error getting or creating UserUsage for user ${userId}:`,
      error
    );
    throw new InternalServerError(
      ErrorMessages.UserUsage.FETCH_CREATE_ERROR.message,
      ErrorMessages.UserUsage.FETCH_CREATE_ERROR.code
    );
  }
};

/**
 * Updates a user's usage record.
 * @param userId The ID of the user.
 * @param updates The updates to apply to the usage record.
 * @returns The updated user usage record.
 */
export const updateUserUsage = async (
  userId: string,
  updates: Partial<IUserUsage>
): Promise<IUserUsage | null> => {
  try {
    const userUsage = await UserUsage.findOneAndUpdate({ userId }, updates, {
      new: true,
    });
    if (!userUsage) {
      logger.warn(`UserUsage record not found for update: ${userId}`);
    }
    return userUsage;
  } catch (error) {
    logger.error(`Error updating UserUsage for user ${userId}:`, error);
    throw new InternalServerError(
      ErrorMessages.UserUsage.UPDATE_ERROR.message,
      ErrorMessages.UserUsage.UPDATE_ERROR.code
    );
  }
};

/**
 * Increments webhook message count and handles daily reset.
 * @param userId The ID of the user.
 * @returns The updated user usage record.
 */
export const incrementWebhookMessageCount = async (
  userId: string
): Promise<IUserUsage> => {
  try {
    const userUsage = await getOrCreateUserUsage(userId);

    const now = new Date();
    const lastWebhookMessageDate = userUsage.lastWebhookMessageDate;

    // Check if it's a new day (using UTC for consistency)
    if (
      lastWebhookMessageDate.getUTCFullYear() !== now.getUTCFullYear() ||
      lastWebhookMessageDate.getUTCMonth() !== now.getUTCMonth() ||
      lastWebhookMessageDate.getUTCDate() !== now.getUTCDate()
    ) {
      userUsage.webhookMessagesSentToday = 0; // Reset for new day
    }

    userUsage.webhookMessagesSentToday += 1;
    userUsage.lastWebhookMessageDate = now;
    return await userUsage.save();
  } catch (error) {
    logger.error(
      `Error incrementing webhook message count for user ${userId}:`,
      error
    );
    throw new InternalServerError(
      ErrorMessages.UserUsage.UPDATE_ERROR.message,
      ErrorMessages.UserUsage.UPDATE_ERROR.code
    );
  }
};

/**
 * Updates media storage usage.
 * @param userId The ID of the user.
 * @param sizeChange The change in size (positive for add, negative for remove) in bytes.
 * @returns The updated user usage record.
 */
export const updateMediaStorageUsed = async (
  userId: string,
  sizeChange: number
): Promise<IUserUsage> => {
  try {
    const userUsage = await getOrCreateUserUsage(userId);

    userUsage.totalMediaStorageUsed += sizeChange;

    // Ensure totalMediaStorageUsed doesn't go below zero
    if (userUsage.totalMediaStorageUsed < 0) {
      userUsage.totalMediaStorageUsed = 0;
    }
    return await userUsage.save();
  } catch (error) {
    logger.error(`Error updating media storage for user ${userId}:`, error);
    throw new InternalServerError(
      ErrorMessages.UserUsage.UPDATE_ERROR.message,
      ErrorMessages.UserUsage.UPDATE_ERROR.code
    );
  }
};

/**
 * Checks if a user has reached their daily webhook message limit.
 * @param userId The ID of the user.
 * @returns True if the limit is reached, false otherwise.
 */
export const isUserWebhookLimitReached = async (
  userId: string
): Promise<boolean> => {
  try {
    const { limits, currentUsage } = await getUserUsageAndLimits(userId);
    return (
      currentUsage.webhookMessagesSentToday >= limits.dailyWebhookMessageLimit
    );
  } catch (error) {
    logger.error(`Error checking webhook limit for user ${userId}:`, error);
    throw new InternalServerError(
      ErrorMessages.UserUsage.FETCH_CREATE_ERROR.message,
      ErrorMessages.UserUsage.FETCH_CREATE_ERROR.code
    );
  }
};
/**
 * Checks if a user will exceed their overall media storage limit with a new upload.
 * @param userId The ID of the user.
 * @param newMediaSize The size of the new media to be uploaded (in bytes).
 * @returns True if the limit will be exceeded, false otherwise.
 */
export const isUserMediaLimitReached = async (
  userId: string,
  newMediaSize: number
): Promise<boolean> => {
  const { limits, currentUsage } = await getUserUsageAndLimits(userId);
  const potentialNewTotal = currentUsage.totalMediaStorageUsed + newMediaSize;
  return potentialNewTotal >= limits.overallMediaStorageLimit;
};

/**
 * Retrieves a user's current usage and their effective limits.
 * @param userId The ID of the user.
 * @returns An object containing the user's current usage and their calculated limits.
 */
export const getUserUsageAndLimits = async (userId: string) => {
  try {
    const userUsage = await getOrCreateUserUsage(userId);

    if (!userUsage) {
      throw new BadRequestError(
        ErrorMessages.UserUsage.FETCH_CREATE_ERROR.message,
        ErrorMessages.UserUsage.FETCH_CREATE_ERROR.code
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      logger.warn(`User not found for usage and limits check: ${userId}`);
      throw new InternalServerError(
        ErrorMessages.UserUsage.FETCH_CREATE_ERROR.message,
        ErrorMessages.UserUsage.FETCH_CREATE_ERROR.code
      );
    }

    let dailyWebhookMessageLimit = FREE_PLAN_DAILY_WEBHOOK_MESSAGE_LIMIT;
    let overallMediaStorageLimit = DEFAULT_MEDIA_STORAGE_LIMIT_BYTES;

    // Apply overrides for webhook messages
    if (userUsage.overrides?.unlimitedWebhookMessages) {
      dailyWebhookMessageLimit = Infinity; // Effectively unlimited
    } else if (
      userUsage.overrides?.dailyWebhookMessageLimit !== undefined &&
      userUsage.overrides.dailyWebhookMessageLimit !== null
    ) {
      dailyWebhookMessageLimit = userUsage.overrides.dailyWebhookMessageLimit;
    } else {
      switch (user.accountType) {
        case 'paid':
          dailyWebhookMessageLimit = PAID_PLAN_DAILY_WEBHOOK_MESSAGE_LIMIT;
          break;
        case 'premium':
          dailyWebhookMessageLimit = PREMIUM_PLAN_DAILY_WEBHOOK_MESSAGE_LIMIT;
          break;
        case 'free':
        default:
          dailyWebhookMessageLimit = FREE_PLAN_DAILY_WEBHOOK_MESSAGE_LIMIT;
          break;
      }
    }

    // Apply overrides for media storage
    if (
      userUsage.overrides?.overallMediaStorageLimit !== undefined &&
      userUsage.overrides.overallMediaStorageLimit !== null
    ) {
      overallMediaStorageLimit = userUsage.overrides.overallMediaStorageLimit;
    } else {
      switch (user.accountType) {
        case 'paid':
          overallMediaStorageLimit = PAID_PLAN_MEDIA_STORAGE_LIMIT_BYTES;
          break;
        case 'premium':
          overallMediaStorageLimit = PREMIUM_PLAN_MEDIA_STORAGE_LIMIT_BYTES;
          break;
        case 'free':
        default:
          overallMediaStorageLimit = DEFAULT_MEDIA_STORAGE_LIMIT_BYTES;
          break;
      }
    }

    return {
      currentUsage: userUsage,
      limits: {
        dailyWebhookMessageLimit,
        overallMediaStorageLimit,
      },
    };
  } catch (error) {
    logger.error(
      `Error retrieving usage and limits for user ${userId}:`,
      error
    );
    throw new InternalServerError(
      ErrorMessages.UserUsage.FETCH_CREATE_ERROR.message,
      ErrorMessages.UserUsage.FETCH_CREATE_ERROR.code
    );
  }
};

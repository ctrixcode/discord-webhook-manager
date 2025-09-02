import UserUsage, { IUserUsage } from '../models/UserUsage';
import User from '../models/User'; // Import User model
import { logger } from '../utils';
import {
  // Import usage constants
  FREE_PLAN_DAILY_WEBHOOK_MESSAGE_LIMIT,
  DEFAULT_MEDIA_STORAGE_LIMIT_BYTES,
  PAID_PLAN_DAILY_WEBHOOK_MESSAGE_LIMIT,
  PAID_PLAN_MEDIA_STORAGE_LIMIT_BYTES,
  PREMIUM_PLAN_DAILY_WEBHOOK_MESSAGE_LIMIT,
  PREMIUM_PLAN_MEDIA_STORAGE_LIMIT_BYTES,
} from '../config/usage';

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
    throw new Error('Failed to retrieve or create user usage record.');
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
    throw new Error('Failed to update user usage record.');
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
  const userUsage = await getOrCreateUserUsage(userId);

  const now = new Date();
  const lastMessageDate = userUsage.lastWebhookMessageDate;

  // Check if it's a new day (using UTC for consistency)
  if (
    lastMessageDate.getUTCFullYear() !== now.getUTCFullYear() ||
    lastMessageDate.getUTCMonth() !== now.getUTCMonth() ||
    lastMessageDate.getUTCDate() !== now.getUTCDate()
  ) {
    userUsage.webhookMessagesSentToday = 0; // Reset for new day
  }

  userUsage.webhookMessagesSentToday += 1;
  userUsage.lastWebhookMessageDate = now;

  return await userUsage.save();
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
  const userUsage = await getOrCreateUserUsage(userId);
  userUsage.totalMediaStorageUsed += sizeChange;
  // Ensure totalMediaStorageUsed doesn't go below zero
  if (userUsage.totalMediaStorageUsed < 0) {
    userUsage.totalMediaStorageUsed = 0;
  }
  return await userUsage.save();
};

/**
 * Checks if a user has reached their daily webhook message limit.
 * @param userId The ID of the user.
 * @returns True if the limit is reached, false otherwise.
 */
export const isUserWebhookLimitReached = async (
  userId: string
): Promise<boolean> => {
  const userUsage = await getOrCreateUserUsage(userId);
  const user = await User.findById(userId); // Assuming User model has accountType

  if (!user) {
    logger.warn(`User not found for limit check: ${userId}`);
    return true; // Or handle as an error, depending on desired behavior
  }

  // Determine effective limit
  let effectiveLimit = FREE_PLAN_DAILY_WEBHOOK_MESSAGE_LIMIT; // Default for free users

  if (userUsage.overrides?.unlimitedWebhookMessages) {
    return false; // User has unlimited messages
  }

  if (
    userUsage.overrides?.dailyWebhookMessageLimit !== undefined &&
    userUsage.overrides.dailyWebhookMessageLimit !== null
  ) {
    effectiveLimit = userUsage.overrides.dailyWebhookMessageLimit;
  } else {
    switch (user.accountType) {
      case 'paid':
        effectiveLimit = PAID_PLAN_DAILY_WEBHOOK_MESSAGE_LIMIT;
        break;
      case 'premium':
        effectiveLimit = PREMIUM_PLAN_DAILY_WEBHOOK_MESSAGE_LIMIT;
        break;
      case 'free':
      default:
        effectiveLimit = FREE_PLAN_DAILY_WEBHOOK_MESSAGE_LIMIT;
        break;
    }
  }

  return userUsage.webhookMessagesSentToday >= effectiveLimit;
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
  const userUsage = await getOrCreateUserUsage(userId);
  const user = await User.findById(userId); // Assuming User model has accountType

  if (!user) {
    logger.warn(`User not found for limit check: ${userId}`);
    return true; // Or handle as an error
  }

  // Determine effective limit
  let effectiveLimit = DEFAULT_MEDIA_STORAGE_LIMIT_BYTES; // Default for free users

  if (
    userUsage.overrides?.overallMediaStorageLimit !== undefined &&
    userUsage.overrides.overallMediaStorageLimit !== null
  ) {
    effectiveLimit = userUsage.overrides.overallMediaStorageLimit;
  } else {
    switch (user.accountType) {
      case 'paid':
        effectiveLimit = PAID_PLAN_MEDIA_STORAGE_LIMIT_BYTES;
        break;
      case 'premium':
        effectiveLimit = PREMIUM_PLAN_MEDIA_STORAGE_LIMIT_BYTES;
        break;
      case 'free':
      default:
        effectiveLimit = DEFAULT_MEDIA_STORAGE_LIMIT_BYTES;
        break;
    }
  }

  const potentialNewTotal = userUsage.totalMediaStorageUsed + newMediaSize;

  return potentialNewTotal >= effectiveLimit;
};

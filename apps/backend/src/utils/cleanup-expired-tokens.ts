import { logger } from '.';
import EmailVerificationTokenModel from '../models/EmailVerificationToken';

/**
 * Cleans up expired and used email verification tokens
 * Should be run periodically (e.g., daily via cron job)
 */
export async function cleanupExpiredTokens(): Promise<void> {
  try {
    const result = await EmailVerificationTokenModel.deleteMany({
      $or: [
        { expiresAt: { $lt: new Date() } }, // Expired tokens
        {
          isUsed: true,
          updatedAt: { $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        }, // Used tokens older than 7 days
      ],
    });

    logger.info(
      `Cleaned up ${result.deletedCount} expired/used email verification tokens`
    );
  } catch (error) {
    logger.error('Error cleaning up expired tokens:', error);
  }
}

/**
 * Starts a periodic cleanup job
 * Runs every 24 hours
 */
export function startTokenCleanupJob(): NodeJS.Timeout {
  // Run immediately on startup
  cleanupExpiredTokens();

  // Then run every 24 hours
  const interval = setInterval(
    () => {
      cleanupExpiredTokens();
    },
    24 * 60 * 60 * 1000
  ); // 24 hours

  logger.info(
    'Email verification token cleanup job started (runs every 24 hours)'
  );

  return interval;
}

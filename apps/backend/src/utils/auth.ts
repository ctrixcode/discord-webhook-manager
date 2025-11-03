import bcrypt from 'bcryptjs';
import { logger } from './index';

/**
 * Get validated SALT_ROUNDS from environment or use secure default
 * Valid range: 10-15 for security and performance balance
 */
const SALT_ROUNDS = (() => {
  const envValue = process.env.SALT_ROUNDS;
  const rounds = parseInt(envValue || '10', 10);

  // Validate: must be a number between 10-15
  if (isNaN(rounds) || rounds < 10 || rounds > 15) {
    logger.warn(
      `Invalid SALT_ROUNDS value: "${envValue}". Using default: 10. Valid range is 10-15.`
    );
    return 10;
  }

  return rounds;
})();

/**
 * Hash a password using bcrypt
 * @param password - Plain text password
 * @returns Hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compare a plain text password with a hashed password
 * @param password - Plain text password
 * @param hash - Hashed password to compare against
 * @returns True if passwords match, false otherwise
 */
export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

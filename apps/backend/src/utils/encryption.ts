import * as crypto from 'crypto';
import { logger } from './logger';
import dotnev from 'dotenv';
dotnev.config();
const ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY as string;

// if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32)
if (!ENCRYPTION_KEY) {
  // Unsure about the required length of 32 .
  logger.error(
    'ENCRYPTION_KEY must be a 32-byte string. Please set it in your .env file.'
  );
  process.exit(1);
}

export function encrypt(
  text: string,
  iv?: string
): { iv: string; encryptedData: string } {
  const encryptionIv = iv ? Buffer.from(iv, 'hex') : crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    ALGORITHM,
    Buffer.from(ENCRYPTION_KEY),
    encryptionIv
  );
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return {
    iv: encryptionIv.toString('hex'),
    encryptedData: encrypted.toString('hex'),
  };
}

export function decrypt(encryptedData: string, iv: string): string {
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(ENCRYPTION_KEY),
    Buffer.from(iv, 'hex')
  );
  let decrypted = decipher.update(Buffer.from(encryptedData, 'hex'));
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

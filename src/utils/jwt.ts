import jwt, { SignOptions } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey'; // Should be a strong, unique secret
const JWT_ACCESS_TOKEN_EXPIRES_IN: string | number = process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || '15m';
const JWT_REFRESH_TOKEN_EXPIRES_IN: string | number = process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || '7d';

interface TokenPayload {
  userId: string;
  email: string;
  // Add any other data you want to store in the token payload
}

/**
 * Generates an access token.
 * @param payload The data to include in the token.
 * @returns The generated access token string.
 */
export const generateAccessToken = (payload: TokenPayload): string => {
  const options: SignOptions = { expiresIn: JWT_ACCESS_TOKEN_EXPIRES_IN as jwt.SignOptions['expiresIn'] };
  return jwt.sign(payload, JWT_SECRET, options);
};

/**
 * Generates a refresh token.
 * @param payload The data to include in the token.
 * @returns The generated refresh token string.
 */
export const generateRefreshToken = (payload: TokenPayload): string => {
  const options: SignOptions = { expiresIn: JWT_REFRESH_TOKEN_EXPIRES_IN as jwt.SignOptions['expiresIn'] };
  return jwt.sign(payload, JWT_SECRET, options);
};

/**
 * Verifies a JWT token.
 * @param token The JWT token string to verify.
 * @returns The decoded payload if the token is valid, otherwise throws an error.
 */
export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};

/**
 * Decodes a JWT token without verifying its signature.
 * @param token The JWT token string to decode.
 * @returns The decoded payload or null if decoding fails.
 */
export const decodeToken = (token: string): TokenPayload | null => {
  return jwt.decode(token) as TokenPayload | null;
};

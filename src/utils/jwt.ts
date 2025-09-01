import jwt, { SignOptions } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import AuthSessionTokenModel from '../models/AuthSessionToken';
import { Types } from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey'; // Should be a strong, unique secret
const JWT_ACCESS_TOKEN_EXPIRES_IN: string | number =
  process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || '59m';
const JWT_REFRESH_TOKEN_EXPIRES_IN: string | number =
  process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || '7d';

export interface TokenPayload {
  userId: string;
  email: string;
  jti?: string; // Add jti as an optional property
  // Add any other data you want to store in the token payload
}

/**
 * Generates an access token.
 * @param payload The data to include in the token.
 * @returns The generated access token string.
 */
export const generateAccessToken = (payload: TokenPayload): string => {
  const options: SignOptions = {
    expiresIn: JWT_ACCESS_TOKEN_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  };
  return jwt.sign(payload, JWT_SECRET, options);
};

/**
 * Generates a refresh token and its associated JTI.
 * @param payload The data to include in the token.
 * @returns An object containing the refresh token string and its JTI.
 */
export const generateRefreshToken = (
  payload: TokenPayload,
  userAgent: string
): { refreshToken: string; jti: string } => {
  const jti = uuidv4(); // Generate a unique ID for the token
  const options: SignOptions = {
    expiresIn: JWT_REFRESH_TOKEN_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    jwtid: jti, // Include jti in the token payload
  };
  const refreshToken = jwt.sign(payload, JWT_SECRET, options);

  // Calculate expiration date for database storage
  let expiresInSeconds: number;
  if (typeof JWT_REFRESH_TOKEN_EXPIRES_IN === 'string') {
    const value = parseInt(JWT_REFRESH_TOKEN_EXPIRES_IN.slice(0, -1));
    const unit = JWT_REFRESH_TOKEN_EXPIRES_IN.slice(-1);
    switch (unit) {
      case 's':
        expiresInSeconds = value;
        break;
      case 'm':
        expiresInSeconds = value * 60;
        break;
      case 'h':
        expiresInSeconds = value * 60 * 60;
        break;
      case 'd':
        expiresInSeconds = value * 24 * 60 * 60;
        break;
      case 'w':
        expiresInSeconds = value * 7 * 24 * 60 * 60;
        break;
      default:
        expiresInSeconds = 0; // Should not happen with valid expiresIn
    }
  } else {
    expiresInSeconds = JWT_REFRESH_TOKEN_EXPIRES_IN;
  }

  const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);

  // Save refresh token metadata to database
  const authSessionToken = new AuthSessionTokenModel({
    userId: new Types.ObjectId(payload.userId),
    jti: jti,
    expiresAt: expiresAt,
    isUsed: false,
    userAgent: userAgent,
  });
  authSessionToken
    .save()
    .catch(err => console.error('Error saving AuthSessionToken:', err)); // Log error, but don't block

  return { refreshToken, jti };
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

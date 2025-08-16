import DiscordTokenModel, { IDiscordToken } from '../models/DiscordToken';
import { logger } from '../utils';
import { encrypt, decrypt } from '../utils/encryption';

export interface CreateDiscordTokenData {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user_id: string;
}

export interface UpdateDiscordTokenData {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
}

export interface IDecryptedDiscordToken {
  user_id: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  createdAt: Date;
  updatedAt: Date;
}

export const createDiscordToken = async (
  tokenData: CreateDiscordTokenData
): Promise<IDiscordToken> => {
  try {
    logger.info('Creating new discord token');
    const { iv, encryptedData: encryptedAccessToken } = encrypt(
      tokenData.access_token
    );
    const { encryptedData: encryptedRefreshToken } = encrypt(
      tokenData.refresh_token,
      iv
    ); // Use same IV

    const token = new DiscordTokenModel({
      user_id: tokenData.user_id,
      access_token: encryptedAccessToken,
      refresh_token: encryptedRefreshToken,
      iv: iv,
      expires_at: new Date(Date.now() + tokenData.expires_in * 1000), // Convert seconds to milliseconds and add to current time
    });
    await token.save();
    return token;
  } catch (error) {
    logger.error('Error creating discord token:', error);
    throw error;
  }
};

export const getDiscordTokenByUserId = async (
  userId: string
): Promise<IDecryptedDiscordToken | null> => {
  try {
    const token = await DiscordTokenModel.findOne({ user_id: userId });
    if (!token) {
      logger.warn('Discord token not found for user', { userId });
      return null;
    }

    // Decrypt tokens before returning
    const decryptedAccessToken = decrypt(token.access_token, token.iv);
    const decryptedRefreshToken = decrypt(token.refresh_token, token.iv);

    // Return a new object with decrypted tokens, without modifying the original Mongoose document
    return {
      user_id: token.user_id.toString(),
      access_token: decryptedAccessToken,
      refresh_token: decryptedRefreshToken,
      expires_in: Math.floor((token.expires_at.getTime() - Date.now()) / 1000), // Convert expires_at back to expires_in
      createdAt: token.createdAt,
      updatedAt: token.updatedAt,
    };
  } catch (error) {
    logger.error('Error retrieving discord token by user ID:', error);
    throw error;
  }
};

export const updateDiscordToken = async (
  userId: string,
  updateData: UpdateDiscordTokenData
): Promise<IDecryptedDiscordToken | null> => {
  try {
    const updateFields: Partial<IDiscordToken> = {};
    let iv: string | undefined;

    // Fetch existing token to get the current IV if only one token is updated
    const existingToken = await DiscordTokenModel.findOne({ user_id: userId });
    if (existingToken) {
      iv = existingToken.iv;
    }

    if (updateData.access_token) {
      const encrypted = encrypt(updateData.access_token, iv);
      updateFields.access_token = encrypted.encryptedData;
      updateFields.iv = encrypted.iv; // Update IV if a new one was generated
      iv = encrypted.iv; // Ensure IV is consistent for refresh token if it's also updated
    }
    if (updateData.refresh_token) {
      const encrypted = encrypt(updateData.refresh_token, iv);
      updateFields.refresh_token = encrypted.encryptedData;
      updateFields.iv = encrypted.iv; // Update IV if a new one was generated
    }
    if (updateData.expires_in) {
      updateFields.expires_at = new Date(
        Date.now() + updateData.expires_in * 1000
      );
    }

    const token = await DiscordTokenModel.findOneAndUpdate(
      { user_id: userId },
      updateFields,
      { new: true }
    );
    if (!token) {
      logger.warn('Discord token not found for update for user', { userId });
      return null;
    }

    // Decrypt tokens before returning the updated document
    const decryptedAccessToken = decrypt(token.access_token, token.iv);
    const decryptedRefreshToken = decrypt(token.refresh_token, token.iv);

    return {
      user_id: token.user_id.toString(),
      access_token: decryptedAccessToken,
      refresh_token: decryptedRefreshToken,
      expires_in: Math.floor((token.expires_at.getTime() - Date.now()) / 1000),
      createdAt: token.createdAt,
      updatedAt: token.updatedAt,
    };
  } catch (error) {
    logger.error('Error updating discord token:', error);
    throw error;
  }
};

export const deleteDiscordToken = async (userId: string): Promise<boolean> => {
  try {
    const result = await DiscordTokenModel.findOneAndDelete({
      user_id: userId,
    });
    if (!result) {
      logger.warn('Discord token not found for deletion for user', { userId });
      return false;
    }
    logger.info('Discord token deleted successfully for user', { userId });
    return true;
  } catch (error) {
    logger.error('Error deleting discord token:', error);
    throw error;
  }
};

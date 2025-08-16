import DiscordTokenModel, { IDiscordToken } from '../models/DiscordToken';
import { logger } from '../utils';

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

export const createDiscordToken = async (
  tokenData: CreateDiscordTokenData
): Promise<IDiscordToken> => {
  try {
    logger.info('Creating new discord token');
    const token = new DiscordTokenModel(tokenData);
    await token.save();
    return token;
  } catch (error) {
    logger.error('Error creating discord token:', error);
    throw error;
  }
};

export const getDiscordTokenByUserId = async (
  userId: string
): Promise<IDiscordToken | null> => {
  try {
    const token = await DiscordTokenModel.findOne({ user_id: userId });
    if (!token) {
      logger.warn('Discord token not found for user', { userId });
      return null;
    }
    logger.info('Discord token retrieved successfully for user', { userId });
    return token;
  } catch (error) {
    logger.error('Error retrieving discord token by user ID:', error);
    throw error;
  }
};

export const updateDiscordToken = async (
  userId: string,
  updateData: UpdateDiscordTokenData
): Promise<IDiscordToken | null> => {
  try {
    const token = await DiscordTokenModel.findOneAndUpdate(
      { user_id: userId },
      updateData,
      { new: true }
    );
    if (!token) {
      logger.warn('Discord token not found for update for user', { userId });
      return null;
    }
    logger.info('Discord token updated successfully for user', { userId });
    return token;
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

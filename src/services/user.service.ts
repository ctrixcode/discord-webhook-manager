import UserModel, { IUser } from '../models/User';
import { logger } from '../utils';

export interface CreateUserData {
  email: string;
  password?: string;
  discord_id?: string;
  username?: string;
}

export interface UpdateUserData {
  email?: string;
  password?: string;
  discord_id?: string;
  username?: string;
}

export interface UserParams {
  id?: string;
}

export interface UserQuery {
  page?: string;
  limit?: string;
}

/**
 * Create a new user
 */
export const createUser = async (userData: CreateUserData): Promise<IUser> => {
  try {
    logger.info('Creating new user', { email: userData.email });
    const user = new UserModel(userData);
    await user.save();
    return user;
  } catch (error) {
    logger.error('Error creating user:', error);
    throw error;
  }
};

/**
 * Get all users with pagination and filtering
 */
export const getUsers = async (
  page: number = 1,
  limit: number = 10
): Promise<{ users: IUser[]; total: number }> => {
  try {
    const skip = (page - 1) * limit;
    const users = await UserModel.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    const total = await UserModel.countDocuments();
    logger.info('Users retrieved successfully', {
      count: users.length,
      page,
      limit,
    });
    return { users, total };
  } catch (error) {
    logger.error('Error retrieving users:', error);
    throw error;
  }
};

/**
 * Get user by ID
 */
export const getUserById = async (userId: string): Promise<IUser | null> => {
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      logger.warn('User not found', { userId });
      return null;
    }
    logger.info('User retrieved successfully', { userId });
    return user;
  } catch (error) {
    logger.error('Error retrieving user:', error);
    throw error;
  }
};

/**
 * Update user
 */
export const updateUser = async (
  userId: string,
  updateData: UpdateUserData
): Promise<IUser | null> => {
  try {
    const user = await UserModel.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
    if (!user) {
      logger.warn('User not found for update', { userId });
      return null;
    }
    logger.info('User updated successfully', { userId });
    return user;
  } catch (error) {
    logger.error('Error updating user:', error);
    throw error;
  }
};

/**
 * Soft delete user by setting deleted_at timestamp
 */
export const deleteUser = async (userId: string): Promise<boolean> => {
  try {
    const result = await UserModel.findByIdAndUpdate(
      userId,
      { deleted_at: new Date() },
      { new: true }
    );
    if (!result) {
      logger.warn('User not found for deletion', { userId });
      return false;
    }
    logger.info('User deleted successfully', { userId });
    return true;
  } catch (error) {
    logger.error('Error deleting user:', error);
    throw error;
  }
};

/**
 * Get user by email
 */
export const getUserByEmail = async (email: string): Promise<IUser | null> => {
  try {
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      logger.warn('User not found by email', { email });
      return null;
    }
    logger.info('User retrieved successfully by email', { email });
    return user;
  } catch (error) {
    logger.error('Error retrieving user by email:', error);
    throw error;
  }
};

/**
 * Get user by discord_id
 */
export const getUserByDiscordId = async (
  discordId: string
): Promise<IUser | null> => {
  try {
    const user = await UserModel.findOne({
      discord_id: discordId,
      deleted_at: null,
    });
    if (!user) {
      logger.warn('User not found by discord_id', { discordId });
      return null;
    }
    logger.info('User retrieved successfully by discord_id', { discordId });
    return user;
  } catch (error) {
    logger.error('Error retrieving user by discord_id:', error);
    throw error;
  }
};

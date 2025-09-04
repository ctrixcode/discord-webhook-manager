import mongoose from 'mongoose';
import UserModel, { IUser } from '../models/User';
import { logger } from '../utils';
import { ErrorMessages } from '../utils/errorMessages';
import { InternalServerError, NotFoundError } from '../utils/errors';
import { HttpStatusCode } from '../utils/httpcode';

export interface CreateUserData {
  email: string;
  password?: string;
  discord_id?: string;
  username?: string;
  discord_avatar?: string;
  guilds?: { id: string; name: string; icon: string | null }[];
}

export interface UpdateUserData {
  email?: string;
  password?: string;
  discord_id?: string;
  username?: string;
  discord_avatar?: string;
  guilds?: { id: string; name: string; icon: string | null }[];
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
    if (error instanceof mongoose.Error.ValidationError) {
      logger.error('Mongoose Validation Error:', error);
      throw new InternalServerError(
        ErrorMessages.Generic.INVALID_INPUT_ERROR.message,
        ErrorMessages.Generic.INVALID_INPUT_ERROR.code,
        HttpStatusCode.BAD_REQUEST
      );
    }
    logger.error('Error creating user:', error);
    throw new InternalServerError(
      ErrorMessages.User.CREATION_ERROR.message,
      ErrorMessages.User.CREATION_ERROR.code,
      HttpStatusCode.INTERNAL_SERVER_ERROR
    );
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
    throw new InternalServerError(
      ErrorMessages.User.FETCH_ERROR.message,
      ErrorMessages.User.FETCH_ERROR.code,
      HttpStatusCode.INTERNAL_SERVER_ERROR
    );
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
    throw new InternalServerError(
      ErrorMessages.User.FETCH_ERROR.message,
      ErrorMessages.User.FETCH_ERROR.code,
      HttpStatusCode.INTERNAL_SERVER_ERROR
    );
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
    if (error instanceof mongoose.Error.ValidationError) {
      logger.error('Mongoose Validation Error in updateUser:', error);
      throw new InternalServerError(
        ErrorMessages.Generic.INVALID_INPUT_ERROR.message,
        ErrorMessages.Generic.INVALID_INPUT_ERROR.code,
        HttpStatusCode.BAD_REQUEST
      );
    }
    logger.error('Error updating user:', error);
    throw new InternalServerError(
      ErrorMessages.User.UPDATE_ERROR.message,
      ErrorMessages.User.UPDATE_ERROR.code,
      HttpStatusCode.INTERNAL_SERVER_ERROR
    );
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
    throw new InternalServerError(
      ErrorMessages.User.DELETE_ERROR.message,
      ErrorMessages.User.DELETE_ERROR.code,
      HttpStatusCode.INTERNAL_SERVER_ERROR
    );
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
    if (error instanceof mongoose.Error.DocumentNotFoundError) {
      logger.error(
        'Mongoose Document Not Found Error in getUserByEmail:',
        error
      );
      throw new NotFoundError(
        ErrorMessages.User.NOT_FOUND_ERROR.message,
        ErrorMessages.User.NOT_FOUND_ERROR.code
      );
    }
    logger.error('Error retrieving user by email:', error);
    throw new InternalServerError(
      ErrorMessages.User.FETCH_ERROR.message,
      ErrorMessages.User.FETCH_ERROR.code,
      HttpStatusCode.INTERNAL_SERVER_ERROR
    );
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
    if (error instanceof mongoose.Error.DocumentNotFoundError) {
      logger.error(
        'Mongoose Document Not Found Error in getUserByEmail:',
        error
      );
      throw new NotFoundError(
        ErrorMessages.User.NOT_FOUND_ERROR.message,
        ErrorMessages.User.NOT_FOUND_ERROR.code
      );
    }
    logger.error('Error retrieving user by discord_id:', error);
    throw new InternalServerError(
      ErrorMessages.User.FETCH_ERROR.message,
      ErrorMessages.User.FETCH_ERROR.code,
      HttpStatusCode.INTERNAL_SERVER_ERROR
    );
  }
};

import AvatarModel, { IAvatar } from '../models/avatar';
import mongoose, { Types } from 'mongoose';
import { uploadImage, deleteImage } from '../services/cloudinary.service'; // Import deleteImage
import {
  InternalServerError,
  UsageLimitExceededError,
  ExternalApiError,
  InvalidInputError,
} from '../utils/errors';
import { ErrorMessages } from '../utils/errorMessages';
import { logger } from '../utils';

/**
 * Creates a new avatar for a specific user.
 * @param userId The ID of the user creating the avatar.
 * @param avatarData The data for the new avatar.
 * @returns The created avatar document.
 */
export const createAvatar = async (
  userId: string,
  avatarData: Partial<IAvatar>
): Promise<IAvatar> => {
  try {
    const newAvatar = new AvatarModel({
      ...avatarData,
      user_id: new Types.ObjectId(userId),
    });
    return newAvatar.save();
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      logger.error('Validation error creating avatar:', error);
      throw new InvalidInputError(
        ErrorMessages.Generic.INVALID_INPUT_ERROR.message,
        ErrorMessages.Generic.INVALID_INPUT_ERROR.code,
        error.errors
      );
    }
    logger.error('Error creating avatar:', error);
    throw new InternalServerError(
      ErrorMessages.Avatar.CREATION_ERROR.message,
      ErrorMessages.Avatar.CREATION_ERROR.code
    );
  }
};

/**
 * Uploads an avatar to Cloudinary and creates a new avatar record in the database.
 * @param userId The ID of the user uploading the avatar.
 * @param username The username of the user (for Cloudinary folder).
 * @param avatarName The name of the avatar (for Cloudinary filename).
 * @param filePath The temporary file path of the avatar.
 * @param fileSize The size of the avatar file in bytes. // Added fileSize
 * @returns The created avatar document.
 */
export const uploadAvatar = async (
  userId: string,
  username: string,
  avatarName: string,
  filePath: string,
  fileSize: number
): Promise<IAvatar> => {
  try {
    const uploadResult = await uploadImage(
      filePath,
      username,
      avatarName,
      userId,
      fileSize
    );

    const newAvatar = new AvatarModel({
      user_id: new Types.ObjectId(userId),
      username: username,
      avatar_url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      size: fileSize,
    });

    return newAvatar.save();
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      logger.error('Validation error uploading avatar:', error);
      throw new InvalidInputError(
        ErrorMessages.Generic.INVALID_INPUT_ERROR.message,
        ErrorMessages.Generic.INVALID_INPUT_ERROR.code,
        error.errors
      );
    } else if (
      error instanceof UsageLimitExceededError ||
      error instanceof ExternalApiError
    ) {
      logger.error('Error uploading avatar:', error);
      throw error;
    }
    throw new InternalServerError(
      ErrorMessages.Avatar.UPLOAD_ERROR.message,
      ErrorMessages.Avatar.UPLOAD_ERROR.code
    );
  }
};

/**
 * Retrieves a single avatar by its ID, ensuring it belongs to the specified user.
 * @param userId The ID of the user.
 * @param avatarId The ID of the avatar to retrieve.
 * @returns The avatar document, or null if not found or not owned by the user.
 */
export const getAvatar = async (
  userId: string,
  avatarId: string
): Promise<IAvatar | null> => {
  try {
    return AvatarModel.findOne({ _id: avatarId, user_id: userId });
  } catch (error) {
    logger.error('Error retrieving avatar:', error);
    throw new InternalServerError(
      ErrorMessages.Avatar.FETCH_ERROR.message,
      ErrorMessages.Avatar.FETCH_ERROR.code
    );
  }
};

/**
 * Retrieves all avatars belonging to a specific user.
 * @param userId The ID of the user.
 * @returns An array of avatar documents.
 */
export const getAvatars = async (userId: string): Promise<IAvatar[]> => {
  try {
    return AvatarModel.find({ user_id: userId });
  } catch (error) {
    logger.error('Error retrieving avatars:', error);
    throw new InternalServerError(
      ErrorMessages.Avatar.FETCH_ERROR.message,
      ErrorMessages.Avatar.FETCH_ERROR.code
    );
  }
};

/**
 * Updates an existing avatar by its ID, ensuring it belongs to the specified user.
 * @param userId The ID of the user.
 * @param avatarId The ID of the avatar to update.
 * @param updateData The data to update the avatar with.
 * @returns The updated avatar document, or null if not found or not owned by the user.
 */
export const updateAvatar = async (
  userId: string,
  avatarId: string,
  updateData: Partial<IAvatar>
): Promise<IAvatar | null> => {
  try {
    return AvatarModel.findOneAndUpdate(
      { _id: avatarId, user_id: userId },
      { $set: updateData },
      { new: true }
    );
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      logger.error('validation error updating avatar:', error);
      throw new InvalidInputError(
        ErrorMessages.Generic.INVALID_INPUT_ERROR.message,
        ErrorMessages.Generic.INVALID_INPUT_ERROR.code,
        error.errors
      );
    }
    logger.error('error updating avatar:', error);
    throw new InternalServerError(
      ErrorMessages.Avatar.UPDATE_ERROR.message,
      ErrorMessages.Avatar.UPDATE_ERROR.code
    );
  }
};

/**
 * Deletes an avatar by its ID, ensuring it belongs to the specified user.
 * @param userId The ID of the user.
 * @param avatarId The ID of the avatar to delete.
 * @returns The deleted avatar document, or null if not found or not owned by the user.
 */
export const deleteAvatar = async (
  userId: string,
  avatarId: string
): Promise<IAvatar | null> => {
  try {
    const avatarToDelete = await AvatarModel.findOne({
      _id: avatarId,
      user_id: userId,
    });
    if (!avatarToDelete) {
      return null; // Avatar not found or not owned by user
    }

    // Delete image from Cloudinary and update user usage
    await deleteImage(avatarToDelete.public_id, userId, avatarToDelete.size!); // Use non-null assertion

    return AvatarModel.findOneAndDelete({ _id: avatarId, user_id: userId });
  } catch (error) {
    logger.error('Error deleting avatar:', error);
    throw new InternalServerError(
      ErrorMessages.Avatar.DELETE_ERROR.message,
      ErrorMessages.Avatar.DELETE_ERROR.code
    );
  }
};

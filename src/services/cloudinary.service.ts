import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import * as userUsageService from './user-usage.service'; // Import userUsageService
import {
  ExternalApiError,
  InternalServerError,
  UsageLimitExceededError,
} from '../utils/errors'; // Import UsageLimitExceededError
import { logger } from '../utils'; // Import logger
import { HttpStatusCode } from '../utils/httpcode';
import { ErrorMessages } from '../utils/errorMessages';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (
  filePath: string,
  username: string,
  avatarName: string,
  userId: string,
  mediaSize: number
) => {
  try {
    if (await userUsageService.isUserMediaLimitReached(userId, mediaSize)) {
      throw new UsageLimitExceededError(
        'Overall media storage limit exceeded. Upgrade your plan to upload more.',
        'MEDIA_LIMIT',
        403
      );
    }

    const timestamp = new Date().getTime();
    const publicId = `${username}/${avatarName}_${timestamp}`;
    const result = await cloudinary.uploader.upload(filePath, {
      public_id: publicId,
      folder: username,
    });
    if (!result || !result.secure_url || !result.public_id) {
      throw new ExternalApiError(
        ErrorMessages.Cloudinary.UPLOAD_ERROR.message,
        ErrorMessages.Cloudinary.UPLOAD_ERROR.code,
        'cloudinary',
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }

    // Update user's media storage after successful upload
    await userUsageService.updateMediaStorageUsed(userId, mediaSize);

    return result;
  } catch (error) {
    logger.error('Cloudinary upload error:', error);
    if (
      error instanceof UsageLimitExceededError ||
      error instanceof ExternalApiError
    ) {
      throw error;
    }

    throw new InternalServerError(
      ErrorMessages.Cloudinary.UPLOAD_ERROR.message,
      ErrorMessages.Cloudinary.UPLOAD_ERROR.code,
      HttpStatusCode.INTERNAL_SERVER_ERROR
    );
  }
};

export const deleteImage = async (
  publicId: string,
  userId: string,
  mediaSize: number
) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    // Update user's media storage after successful deletion
    await userUsageService.updateMediaStorageUsed(userId, -mediaSize);
    return result;
  } catch (error) {
    logger.error('Cloudinary delete error:', error);
    throw new InternalServerError(
      ErrorMessages.Cloudinary.DELETE_ERROR.message,
      ErrorMessages.Cloudinary.DELETE_ERROR.code,
      HttpStatusCode.INTERNAL_SERVER_ERROR
    );
  }
};

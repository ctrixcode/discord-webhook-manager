import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import * as userUsageService from './user-usage.service'; // Import userUsageService
import { UsageLimitExceededError } from '../utils/errors'; // Import UsageLimitExceededError
import { logger } from '../utils'; // Import logger

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
  userId: string, // Added userId
  mediaSize: number // Added mediaSize in bytes
) => {
  try {
    // Check media limit before uploading
    if (await userUsageService.isUserMediaLimitReached(userId, mediaSize)) {
      throw new UsageLimitExceededError(
        'Overall media storage limit exceeded. Upgrade your plan to upload more.',
        'media_limit',
        403
      ); // Throw custom error
    }

    const timestamp = new Date().getTime();
    const publicId = `${username}/${avatarName}_${timestamp}`;
    const result = await cloudinary.uploader.upload(filePath, {
      public_id: publicId,
      folder: username,
    });

    // Update user's media storage after successful upload
    await userUsageService.updateMediaStorageUsed(userId, mediaSize);

    return result;
  } catch (error) {
    logger.error('Cloudinary upload error:', error); // Changed to logger.error
    throw error; // Re-throw the original error
  }
};

export const deleteImage = async (
  publicId: string,
  userId: string, // Added userId
  mediaSize: number // Added mediaSize in bytes (size of the image being deleted)
) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    // Update user's media storage after successful deletion
    await userUsageService.updateMediaStorageUsed(userId, -mediaSize); // Subtract size
    return result;
  } catch (error) {
    logger.error('Cloudinary delete error:', error); // Changed to logger.error
    throw error; // Re-throw the original error
  }
};

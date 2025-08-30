import AvatarModel, { IAvatar } from '../models/avatar';
import { Types } from 'mongoose';
import { uploadImage } from '../services/cloudinary.service';

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
  const newAvatar = new AvatarModel({
    ...avatarData,
    user_id: new Types.ObjectId(userId),
  });
  return newAvatar.save();
};

/**
 * Uploads an avatar to Cloudinary and creates a new avatar record in the database.
 * @param userId The ID of the user uploading the avatar.
 * @param username The username of the user (for Cloudinary folder).
 * @param avatarName The name of the avatar (for Cloudinary filename).
 * @param filePath The temporary file path of the avatar.
 * @returns The created avatar document.
 */
export const uploadAvatar = async (
  userId: string,
  username: string,
  avatarName: string,
  filePath: string
): Promise<IAvatar> => {
  const uploadResult = await uploadImage(filePath, username, avatarName);
  const newAvatar = new AvatarModel({
    user_id: new Types.ObjectId(userId),
    username: username,
    avatar_url: uploadResult.secure_url,
    public_id: uploadResult.public_id,
  });
  return newAvatar.save();
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
  return AvatarModel.findOne({ _id: avatarId, user_id: userId });
};

/**
 * Retrieves all avatars belonging to a specific user.
 * @param userId The ID of the user.
 * @returns An array of avatar documents.
 */
export const getAvatars = async (userId: string): Promise<IAvatar[]> => {
  return AvatarModel.find({ user_id: userId });
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
  return AvatarModel.findOneAndUpdate(
    { _id: avatarId, user_id: userId },
    { $set: updateData },
    { new: true }
  );
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
  return AvatarModel.findOneAndDelete({ _id: avatarId, user_id: userId });
};

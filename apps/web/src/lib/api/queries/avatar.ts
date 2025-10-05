import { apiClient } from '../client';
import { Avatar } from '@repo/shared-types';
import { ApiResponse } from '../types/api';

export const avatarQueries = {
  // Get all avatars for current user
  getAllAvatars: async (): Promise<Avatar[]> => {
    const response = await apiClient.get<ApiResponse<Avatar[]>>('/avatar');
    return response.data.data as Avatar[];
  },

  // Get avatar by ID
  getAvatarById: async (id: string): Promise<Avatar> => {
    const response = await apiClient.get<ApiResponse<Avatar>>(`/avatar/${id}`);
    return response.data.data as Avatar;
  },

  // Create avatar
  createAvatar: async (
    data: Omit<Avatar, 'id' | 'createdAt' | 'updatedAt' | 'user_id'>
  ): Promise<Avatar> => {
    const response = await apiClient.post<ApiResponse<Avatar>>('/avatar', data);
    return response.data.data as Avatar;
  },

  // Update avatar
  updateAvatar: async (
    id: string,
    data: Partial<Omit<Avatar, 'id' | 'createdAt' | 'updatedAt' | 'user_id'>>
  ): Promise<Avatar> => {
    const response = await apiClient.put<ApiResponse<Avatar>>(
      `/avatar/${id}`,
      data
    );
    return response.data.data as Avatar;
  },

  // Delete avatar
  deleteAvatar: async (id: string): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`/avatar/${id}`);
  },

  // Upload avatar
  uploadAvatar: async (data: FormData): Promise<Avatar> => {
    const response = await apiClient.post<ApiResponse<Avatar>>(
      '/avatar/upload',
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data as Avatar;
  },
};

export const {
  getAllAvatars,
  getAvatarById,
  createAvatar,
  updateAvatar,
  deleteAvatar,
  uploadAvatar,
} = avatarQueries;

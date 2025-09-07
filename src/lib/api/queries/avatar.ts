import { apiClient } from '../client';
import { IAvatar } from '../types/avatar';
import { ApiResponse } from '../types/api';

export const avatarQueries = {
  // Get all avatars for current user
  getAllAvatars: async (): Promise<IAvatar[]> => {
    const response = await apiClient.get<ApiResponse<IAvatar[]>>('/avatar');
    return response.data.data as IAvatar[];
  },

  // Get avatar by ID
  getAvatarById: async (id: string): Promise<IAvatar> => {
    const response = await apiClient.get<ApiResponse<IAvatar>>(`/avatar/${id}`);
    return response.data.data as IAvatar;
  },

  // Create avatar
  createAvatar: async (data: Omit<IAvatar, 'id' | 'createdAt' | 'updatedAt' | 'user_id'>): Promise<IAvatar> => {
    const response = await apiClient.post<ApiResponse<IAvatar>>('/avatar', data);
    return response.data.data as IAvatar;
  },

  // Update avatar
  updateAvatar: async (id: string, data: Partial<Omit<IAvatar,"id" | "createdAt" | "updatedAt" | "user_id">>): Promise<IAvatar> => {
    const response = await apiClient.put<ApiResponse<IAvatar>>(`/avatar/${id}`, data);
    return response.data.data as IAvatar;
  },

  // Delete avatar
  deleteAvatar: async (id: string): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`/avatar/${id}`);
  },

  // Upload avatar
  uploadAvatar: async (data: FormData): Promise<IAvatar> => {
    const response = await apiClient.post<ApiResponse<IAvatar>>('/avatar/upload', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data as IAvatar;
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
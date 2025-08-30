import { apiClient } from '../client';
import { PredefinedAvatar } from '../types/avatar';

export const avatarQueries = {
  // Get all avatars for current user
  getAllAvatars: async (): Promise<PredefinedAvatar[]> => {
    const response = await apiClient.get<PredefinedAvatar[]>('/avatar');
    return response.data;
  },

  // Get avatar by ID
  getAvatarById: async (id: string): Promise<PredefinedAvatar> => {
    const response = await apiClient.get<PredefinedAvatar>(`/avatar/${id}`);
    return response.data;
  },

  // Create avatar
  createAvatar: async (data: Omit<PredefinedAvatar, 'id' | 'createdAt' | 'updatedAt' | 'user_id'>): Promise<PredefinedAvatar> => {
    const response = await apiClient.post<PredefinedAvatar>('/avatar', data);
    return response.data;
  },

  // Update avatar
  updateAvatar: async (id: string, data: Partial<PredefinedAvatar>): Promise<PredefinedAvatar> => {
    const response = await apiClient.put<PredefinedAvatar>(`/avatar/${id}`, data);
    return response.data;
  },

  // Delete avatar
  deleteAvatar: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete<{ success: boolean; message: string }>(`/avatar/${id}`);
    return response.data;
  },

  // Upload avatar
  uploadAvatar: async (data: FormData): Promise<PredefinedAvatar> => {
    const response = await apiClient.post<PredefinedAvatar>('/avatar/upload', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
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
import { apiClient } from '../client';
import { User, UserUsage } from '@repo/shared-types';
import { ApiResponse } from '../types/api';

export const userQueries = {
  // Get current authenticated user
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>('/user');
    if (!response.data.success) throw new Error('Failed to get user');
    return response.data.data as User;
  },

  // Get user usage
  getUserUsage: async (): Promise<UserUsage> => {
    const response =
      await apiClient.get<ApiResponse<UserUsage>>('/user/me/usage');
    if (!response.data.success) throw new Error('Failed to get user usage');
    return response.data.data as UserUsage;
  },
};

import { apiClient } from '../client';
import { User, UpdateUserRequest } from '../types/user';
import { ApiResponse } from '../types/api';

export const userQueries = {
  // Get current authenticated user
  getCurrentUser: async (): Promise<User> => {
    type rawResponse = {
      success: boolean;
      data: User;
    }
    const response = await apiClient.get<rawResponse>('/user');
    if (!response.data.success) throw new Error('Failed to get user');
    return response.data.data;
  },

  // Get user by ID
  getUserById: async (id: string): Promise<User> => {
   type rawResponse = {
      success: boolean;
      data: User;
    }
    const response = await apiClient.get<rawResponse>(`/user/${id}`);
    return response.data.data;
  },

  // Update user
  updateUser: async (id: string, data: UpdateUserRequest): Promise<User> => {
    type rawResponse = {
      success: boolean;
      data: User;
      message: string;
    }
    const response = await apiClient.put<rawResponse>(`/user/${id}`, data);
    return response.data.data;
  },

  // Delete user
  deleteUser: async (id: string): Promise<ApiResponse> => {
    const response = await apiClient.delete<ApiResponse>(`/user/${id}`);
    return response.data;
  },
};
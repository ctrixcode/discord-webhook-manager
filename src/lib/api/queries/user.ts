import { apiClient } from '../client';
import { User, UpdateUserRequest, ApiResponse } from '../types';

export const userQueries = {
  // Get current authenticated user
  getCurrentUser: async (): Promise<User> => {
    type rawResponse = {
      success: boolean;
      data: User;
    }
    const response = await apiClient.get<rawResponse>('/user');
    return response.data.data;
  },

  // Get user by ID
  getUserById: async (id: string): Promise<User> => {
    const response = await apiClient.get<User>(`/user/${id}`);
    return response.data;
  },

  // Update user
  updateUser: async (id: string, data: UpdateUserRequest): Promise<User> => {
    const response = await apiClient.put<User>(`/user/${id}`, data);
    return response.data;
  },

  // Delete user
  deleteUser: async (id: string): Promise<ApiResponse> => {
    const response = await apiClient.delete<ApiResponse>(`/user/${id}`);
    return response.data;
  },
};
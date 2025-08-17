import { apiClient } from '../client';
import { AuthUser } from '../types';

export const authQueries = {
  // Get current authenticated user
  getCurrentUser: async (): Promise<AuthUser> => {
    const response = await apiClient.get<AuthUser>('/user');
    return response.data;
  },

  // Initiate Discord login (redirects to Discord)
  loginWithDiscord: () => {
    apiClient.redirectToDiscordLogin();
  },

  // Logout (clear tokens)
  logout: () => {
    apiClient.clearAccessToken();
    // You might want to call a logout endpoint here if your backend has one
    // await apiClient.post('/auth/logout');
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('accessToken');
  },
};
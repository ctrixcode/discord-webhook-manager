import { apiClient } from '../client';

export const authQueries = {
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

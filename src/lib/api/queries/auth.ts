import { apiClient } from '../client';

export const authQueries = {
  // Initiate Discord login (redirects to Discord)
  loginWithDiscord: () => {
    apiClient.redirectToDiscordLogin();
  },

  // Logout (clear tokens)
  logout: async () => {
    apiClient.clearAccessToken();
    // You might want to call a logout endpoint here if your backend has one
    await apiClient.post('/auth/logout');
  },
};

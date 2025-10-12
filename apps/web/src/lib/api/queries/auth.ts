import { apiClient } from '../client';

export const authQueries = {
  // Initiate Discord login (redirects to Discord)
  loginWithDiscord: () => {
    apiClient.redirectToDiscordLogin();
  },

  loginWithGoogle: () => {
    apiClient.redirectToGoogleLogin();
  },

  signupWithEmail: async (
    email: string,
    password: string,
    displayName: string,
    username: string
  ) => {
    return await apiClient.redirectToEmailSignup(
      email,
      password,
      displayName,
      username
    );
  },

  loginWithEmail: async (email: string, password: string) => {
    return await apiClient.redirectToEmailLogin(email, password);
  },

  // Logout (clear tokens)
  logout: async () => {
    apiClient.clearAccessToken();
    // You might want to call a logout endpoint here if your backend has one
    await apiClient.post('/auth/logout');
  },
};

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

  // Check if user has password
  checkPassword: async (): Promise<{
    hasPassword: boolean;
  }> => {
    const response = await apiClient.get<{
      success: boolean;
      data: {
        hasPassword: boolean;
      };
    }>('/auth/password/check');
    return response.data.data;
  },

  // Change or create password
  changePassword: async (
    currentPassword: string | undefined,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
    }>('/auth/password/change', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
};

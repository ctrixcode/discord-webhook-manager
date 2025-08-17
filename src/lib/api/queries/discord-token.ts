import { apiClient } from '../client';
import { DiscordToken, CreateDiscordTokenRequest, UpdateDiscordTokenRequest, ApiResponse } from '../types';

export const discordTokenQueries = {
  // Get Discord token by user ID
  getDiscordTokenByUserId: async (userId: string): Promise<DiscordToken> => {
    const response = await apiClient.get<DiscordToken>(`/discord-token/${userId}`);
    return response.data;
  },

  // Create Discord token
  createDiscordToken: async (data: CreateDiscordTokenRequest): Promise<DiscordToken> => {
    const response = await apiClient.post<DiscordToken>('/discord-token', data);
    return response.data;
  },

  // Update Discord token
  updateDiscordToken: async (userId: string, data: UpdateDiscordTokenRequest): Promise<DiscordToken> => {
    const response = await apiClient.put<DiscordToken>(`/discord-token/${userId}`, data);
    return response.data;
  },

  // Delete Discord token
  deleteDiscordToken: async (userId: string): Promise<ApiResponse> => {
    const response = await apiClient.delete<ApiResponse>(`/discord-token/${userId}`);
    return response.data;
  },
};
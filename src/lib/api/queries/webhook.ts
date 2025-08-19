import { apiClient } from '../client';
import { Webhook, CreateWebhookRequest, UpdateWebhookRequest, ApiResponse } from '../types';

export const webhookQueries = {
  // Get all webhooks
  getAllWebhooks: async (): Promise<Webhook[]> => {
    type rawResponse = {
      webhooks: Webhook[];
      total: number;
      page: number;
      limit: number
    }
    const response = await apiClient.get<rawResponse>('/webhook');
    return response.data.webhooks;
  },

  // Get webhook by ID
  getWebhookById: async (id: string): Promise<Webhook> => {
    const response = await apiClient.get<Webhook>(`/webhook/${id}`);
    return response.data;
  },

  // Create webhook
  createWebhook: async (data: CreateWebhookRequest): Promise<Webhook> => {
    const response = await apiClient.post<Webhook>('/webhook', data);
    return response.data;
  },

  // Update webhook
  updateWebhook: async (id: string, data: UpdateWebhookRequest): Promise<Webhook> => {
    const response = await apiClient.put<Webhook>(`/webhook/${id}`, data);
    return response.data;
  },

  // Delete webhook
  deleteWebhook: async (id: string): Promise<ApiResponse> => {
    const response = await apiClient.delete<ApiResponse>(`/webhook/${id}`);
    return response.data;
  },
};

export const {
  getAllWebhooks,
  getWebhookById,
  createWebhook,
  updateWebhook,
  deleteWebhook,
} = webhookQueries;
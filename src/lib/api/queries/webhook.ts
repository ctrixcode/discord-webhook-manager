import { apiClient } from '../client';
import {
  Webhook,
  CreateWebhookRequest,
  UpdateWebhookRequest,
  SendMessageData,
} from '../types/webhook';
import { ApiResponse } from '../types/api';

export const webhookQueries = {
  // Get all webhooks
  getAllWebhooks: async (filters?: { isActive?: boolean }): Promise<Webhook[]> => {
    const params = new URLSearchParams();
    if (filters?.isActive !== undefined) {
      params.append('status', "active");
    }
    const queryString = params.toString();
    const url = queryString ? `/webhook?${queryString}` : '/webhook';
    type rawResponse = {
      webhooks: Webhook[];
      total: number;
      page: number;
      limit: number;
    };
    const response = await apiClient.get<rawResponse>(url);
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
  updateWebhook: async (
    id: string,
    data: UpdateWebhookRequest,
  ): Promise<Webhook> => {
    const response = await apiClient.put<Webhook>(`/webhook/${id}`, data);
    return response.data;
  },

  // Delete webhook
  deleteWebhook: async (id: string): Promise<ApiResponse> => {
    const response = await apiClient.delete<ApiResponse>(`/webhook/${id}`);
    return response.data;
  },

  //test webhook
  testWebhook: async (id: string): Promise<ApiResponse> => {
    const response = await apiClient.post<ApiResponse>(`/webhook/${id}/test`);
    return response.data;
  },

  // send message to webhook
  sendMessage: async (id: string, data: SendMessageData): Promise<ApiResponse> => {
    const response = await apiClient.post<ApiResponse>(
      `/webhook/${id}/send-message`,
      data,
    );
    return response.data;
  },
};

export const {
  getAllWebhooks,
  getWebhookById,
  createWebhook,
  updateWebhook,
  deleteWebhook,
  testWebhook,
} = webhookQueries;

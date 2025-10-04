import { apiClient } from '../client';
import {
  Webhook,
  CreateWebhookRequest,
  UpdateWebhookRequest,
  SendMessageData,
  SendMessageResponse,
} from '../types/webhook';
import { ApiResponse } from '../types/api';

export const webhookQueries = {
  // Get all webhooks
  getAllWebhooks: async ({
    queryKey,
  }: {
    queryKey: readonly [string, { isActive?: boolean }];
  }): Promise<Webhook[]> => {
    const filters = queryKey[1] as { isActive?: boolean } | undefined;
    const params = new URLSearchParams();
    if (filters?.isActive === true) {
      params.append('status', 'active');
    } else if (filters?.isActive === false) {
      params.append('status', 'inactive');
    }
    const queryString = params.toString();
    const url = queryString ? `/webhook?${queryString}` : '/webhook';
    type GetAllResponse = {
      webhooks: Webhook[];
      total: number;
      page: number;
      limit: number;
    };
    const response = await apiClient.get<ApiResponse<GetAllResponse>>(url);
    return response.data.data?.webhooks as Webhook[];
  },

  // Get webhook by ID
  getWebhookById: async (id: string): Promise<Webhook> => {
    const response = await apiClient.get<ApiResponse<Webhook>>(
      `/webhook/${id}`
    );
    return response.data.data as Webhook;
  },

  // Create webhook
  createWebhook: async (data: CreateWebhookRequest): Promise<Webhook> => {
    const response = await apiClient.post<ApiResponse<Webhook>>(
      '/webhook',
      data
    );
    return response.data.data as Webhook;
  },

  // Update webhook
  updateWebhook: async (
    id: string,
    data: UpdateWebhookRequest
  ): Promise<ApiResponse<Webhook>> => {
    const response = await apiClient.put<ApiResponse<Webhook>>(
      `/webhook/${id}`,
      data
    );
    return response.data;
  },

  // Delete webhook
  deleteWebhook: async (id: string): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`/webhook/${id}`);
  },

  //test webhook
  testWebhook: async (id: string): Promise<ApiResponse<void>> => {
    const resp = await apiClient.post<ApiResponse<void>>(`/webhook/${id}/test`);
    return resp.data;
  },

  // send message to webhook
  sendMessage: async (
    data: SendMessageData
  ): Promise<ApiResponse<SendMessageResponse[]>> => {
    const response = await apiClient.post<ApiResponse<SendMessageResponse[]>>(
      `/webhook/send-message`,
      data
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

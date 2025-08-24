import { apiClient } from '../client';
import { ScheduledMessage } from '../types/scheduled-message';

// Get all scheduled messages for current user
export const getAllScheduledMessages = async (): Promise<ScheduledMessage[]> => {
  const response = await apiClient.get<ScheduledMessage[]>('/scheduled-message');
  return response.data;
};

// Process scheduled messages (trigger manual processing)
export const processScheduledMessages = async (): Promise<{ processed: number; message: string }> => {
  const response = await apiClient.post<{ processed: number; message: string }>('/scheduled-message/process');
  return response.data;
};

export const scheduledMessageQueries = {
  // Get scheduled message by ID
  getScheduledMessageById: async (id: string): Promise<ScheduledMessage> => {
    const response = await apiClient.get<ScheduledMessage>(`/scheduled-message/${id}`);
    return response.data;
  },

  // Create scheduled message
  createScheduledMessage: async (data: Omit<ScheduledMessage, 'id' | 'createdAt' | 'user_id' | 'status'>): Promise<ScheduledMessage> => {
    const response = await apiClient.post<ScheduledMessage>('/scheduled-message', data);
    return response.data;
  },

  // Update scheduled message
  updateScheduledMessage: async (id: string, data: Partial<ScheduledMessage>): Promise<ScheduledMessage> => {
    const response = await apiClient.put<ScheduledMessage>(`/scheduled-message/${id}`, data);
    return response.data;
  },

  // Delete scheduled message
  deleteScheduledMessage: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete<{ success: boolean; message: string }>(`/scheduled-message/${id}`);
    return response.data;
  },

  // Cancel scheduled message
  cancelScheduledMessage: async (id: string): Promise<ScheduledMessage> => {
    const response = await apiClient.post<ScheduledMessage>(`/scheduled-message/${id}/cancel`);
    return response.data;
  },
};

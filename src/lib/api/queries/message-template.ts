import { apiClient } from '../client';
import {
  MessageTemplate,
  CreateMessageTemplateRequest,
  UpdateMessageTemplateRequest,
} from '../types/message-template';

export const templateQueries = {
  // Get all templates for current user
  getAllTemplates: async (): Promise<MessageTemplate[]> => {
    type GetAllResponse = {
      messageTemplates: MessageTemplate[];
      total: number;
      page: number;
      limit: number;
    };
    const response = await apiClient.get<GetAllResponse>('/message-template');
    return response.data.messageTemplates;
  },

  // Get template by ID
  getTemplateById: async (id: string): Promise<MessageTemplate> => {
    const response = await apiClient.get<MessageTemplate>(`/message-template/${id}`);
    return response.data;
  },

  // Create template
  createTemplate: async (data: CreateMessageTemplateRequest): Promise<MessageTemplate> => {
    const response = await apiClient.post<MessageTemplate>('/message-template', data);
    return response.data;
  },

  // Update template
  updateTemplate: async (id: string, data: UpdateMessageTemplateRequest): Promise<MessageTemplate> => {
    const response = await apiClient.put<MessageTemplate>(`/message-template/${id}`, data);
    return response.data;
  },

  // Delete template
  deleteTemplate: async (id: string): Promise<void> => {
    await apiClient.delete<void>(`/message-template/${id}`);
  },
};

export const {
  getAllTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} = templateQueries;
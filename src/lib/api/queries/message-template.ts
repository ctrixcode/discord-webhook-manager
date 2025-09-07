import { apiClient } from '../client';
import {
  MessageTemplate,
  CreateMessageTemplateRequest,
  UpdateMessageTemplateRequest,
} from '../types/message-template';
import { ApiResponse } from '../types/api';

export const templateQueries = {
  // Get all templates for current user
  getAllTemplates: async (): Promise<MessageTemplate[]> => {
    type GetAllResponse = {
      messageTemplates: MessageTemplate[];
      total: number;
      page: number;
      limit: number;
    };
    const response = await apiClient.get<ApiResponse<GetAllResponse>>('/message-template');
    return response.data.data?.messageTemplates as MessageTemplate[];
  },

  // Get template by ID
  getTemplateById: async (id: string): Promise<MessageTemplate> => {
    const response = await apiClient.get<ApiResponse<MessageTemplate>>(`/message-template/${id}`);
    return response.data.data as MessageTemplate;
  },

  // Create template
  createTemplate: async (data: CreateMessageTemplateRequest): Promise<MessageTemplate> => {
    const response = await apiClient.post<ApiResponse<MessageTemplate>>('/message-template', data);
    return response.data.data as MessageTemplate;
  },

  // Update template
  updateTemplate: async (id: string, data: UpdateMessageTemplateRequest): Promise<MessageTemplate> => {
    const response = await apiClient.put<ApiResponse<MessageTemplate>>(`/message-template/${id}`, data);
    return response.data.data as MessageTemplate;
  },

  // Delete template
  deleteTemplate: async (id: string): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`/message-template/${id}`);
  },
};

export const {
  getAllTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} = templateQueries;
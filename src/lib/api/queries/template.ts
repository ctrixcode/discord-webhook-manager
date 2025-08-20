import { apiClient } from '../client';
import { MessageTemplate } from '../types';

export const templateQueries = {
  // Get all templates for current user
  getAllTemplates: async (): Promise<MessageTemplate[]> => {
    const response = await apiClient.get<MessageTemplate[]>('/template');
    return response.data;
  },

  // Get template by ID
  getTemplateById: async (id: string): Promise<MessageTemplate> => {
    const response = await apiClient.get<MessageTemplate>(`/template/${id}`);
    return response.data;
  },

  // Create template
  createTemplate: async (data: Omit<MessageTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount' | 'user_id'>): Promise<MessageTemplate> => {
    const response = await apiClient.post<MessageTemplate>('/template', data);
    return response.data;
  },

  // Update template
  updateTemplate: async (id: string, data: Partial<MessageTemplate>): Promise<MessageTemplate> => {
    const response = await apiClient.put<MessageTemplate>(`/template/${id}`, data);
    return response.data;
  },

  // Delete template
  deleteTemplate: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete<{ success: boolean; message: string }>(`/template/${id}`);
    return response.data;
  },

  // Increment template usage count
  incrementTemplateUsage: async (id: string): Promise<MessageTemplate> => {
    const response = await apiClient.post<MessageTemplate>(`/template/${id}/use`);
    return response.data;
  },

  // Duplicate template
  duplicateTemplate: async (id: string): Promise<MessageTemplate> => {
    const response = await apiClient.post<MessageTemplate>(`/template/${id}/duplicate`);
    return response.data;
  },
};
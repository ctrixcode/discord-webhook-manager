import { DiscordEmbed } from './discord';

export interface MessageTemplate {
  id: string;
  userId: string;
  name: string;
  content: string;
  embeds?: DiscordEmbed[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateMessageTemplateRequest {
  name: string;
  description?: string;
  content: string;
  avatar_ref?: string;
  embeds?: DiscordEmbed[];
  attachments?: string[];
}

export interface UpdateMessageTemplateRequest {
  name?: string;
  description?: string;
  content?: string;
  avatar_ref?: string;
  embeds?: DiscordEmbed[];
  attachments?: string[];
}

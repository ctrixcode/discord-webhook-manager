import { DiscordEmbed } from './discord';

export interface MessageTemplate {
  _id: string;
  user_id: string;
  name: string;
  description?: string;
  content: string;
  avatar_ref?: string;
  embeds?: DiscordEmbed[];
  attachments?: string[];
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

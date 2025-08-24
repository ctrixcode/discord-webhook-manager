import { DiscordEmbed } from './discord';

export interface MessageTemplate {
  _id: string; // Backend ID
  user_id: string;
  name: string;
  description?: string;
  content: string;
  avatar_ref?: string; // Reference to a predefined avatar ID
  embeds?: DiscordEmbed[];
  attachments?: string[]; // Array of attachment URLs/IDs
  createdAt: string;
  updatedAt: string;
}

export interface CreateMessageTemplateRequest {
  name: string;
  description?: string;
  content: string;
  avatar_ref?: string; // Reference to a predefined avatar ID
  embeds?: DiscordEmbed[];
  attachments?: string[]; // Array of attachment URLs/IDs
}

export interface UpdateMessageTemplateRequest {
  name?: string;
  description?: string;
  content?: string;
  avatar_ref?: string; // Reference to a predefined avatar ID
  embeds?: DiscordEmbed[];
  attachments?: string[]; // Array of attachment URLs/IDs
}

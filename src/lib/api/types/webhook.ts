import { DiscordEmbed } from "./discord";

export interface Webhook {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  url: string;
  is_active: boolean;
  last_used?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateWebhookRequest {
  name: string;
  url: string;
  description?: string;
}

export interface UpdateWebhookRequest {
  name?: string;
  url?: string;
  description?: string;
  last_used?: string;
  messageCount?: number;
  is_active?: boolean;
}

export interface SendMessageData {
  message: string;
  avatarRefID?: string;
  embeds?: DiscordEmbed[];
}
import { DiscordEmbed } from './discord';

export interface Webhook {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  is_active: string;
  createdAt: string;
  updatedAt: string;
  last_used?: Date | null;
}

export interface CreateWebhookRequest {
  name: string;
  url: string;
  description?: string;
  defaultAvatarId?: string;
}

export interface UpdateWebhookRequest {
  name?: string;
  description?: string;
  defaultAvatarId?: string;
  status?: string;
}

export interface SendMessageData {
  webhookIds: string[];
  messageData: {
    content?: string;
    username?: string;
    avatarUrl?: string;
    embeds?: DiscordEmbed[];
  };
}

export interface SendMessageResponse {
  webhookId: string;
  status: string;
  message: string;
}

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
  is_active?: boolean;
}

export interface SendMessageData {
  webhookIds: string[];
  messageData: {
    message: string;
    avatarRefID?: string;
    tts: boolean;
    embeds?: DiscordEmbed[];
    message_replace_url?: string; // Optional: ID of the message to edit
  };
}

export interface SendMessageResponse {
  webhookId: string;
  status: string;
  message: string;
}

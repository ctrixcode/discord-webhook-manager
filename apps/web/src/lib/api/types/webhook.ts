import { DiscordEmbed } from './discord';
import {
  Webhook,
  CreateWebhookData,
  UpdateWebhookData,
} from '@repo/shared-types';

export type { Webhook, CreateWebhookData, UpdateWebhookData };

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

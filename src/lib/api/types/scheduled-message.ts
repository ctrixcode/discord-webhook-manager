import { DiscordEmbed } from './discord';

export interface ScheduledMessage {
  id: string;
  webhookId: string;
  webhookName: string;
  webhookUrl: string;
  content: string;
  embeds?: DiscordEmbed[];
  scheduledFor: string;
  status: 'pending' | 'sent' | 'failed' | 'cancelled';
  userId: string;
  createdAt: string;
  sentAt?: string;
  errorMessage?: string;
}

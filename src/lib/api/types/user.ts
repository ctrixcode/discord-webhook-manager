export type AccountType = 'free' | 'paid' | 'premium';

export interface User {
  id: string;
  username: string;
  email: string;
  discord_id?: string;
  discord_avatar?: string;
  guilds?: { id: string; name: string; icon: string | null }[];
  createdAt: string;
  updatedAt: string;
  accountType: AccountType;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
}

export interface UserUsage {
  webhookMessagesSentToday: number;
  totalMediaStorageUsed: number;
  dailyWebhookMessageLimit: number;
  overallMediaStorageLimit: number;
}

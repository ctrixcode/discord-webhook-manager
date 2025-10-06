export type AccountType = 'free' | 'paid' | 'premium';

// User DTO - what frontend gets from API
export interface User {
  id: string;
  username: string;
  email: string;
  discord_id?: string;
  discord_avatar?: string;
  accountType: AccountType;
  createdAt: string;
  updatedAt: string;
}

// Create user request data
export interface CreateUserData {
  email: string;
  password?: string;
  username: string;
  discord_id: string;
  discord_avatar: string;
  guilds?: { id: string; name: string; icon: string | null }[];
}

// Update user request data
export interface UpdateUserData {
  email?: string;
  password?: string;
  username?: string;
  discord_id?: string;
  discord_avatar?: string;
  guilds?: { id: string; name: string; icon: string | null }[];
}

// User usage/limits data
export interface UserUsage {
  webhookMessagesSentToday: number;
  totalMediaStorageUsed: number;
  dailyWebhookMessageLimit: number;
  overallMediaStorageLimit: number;
}

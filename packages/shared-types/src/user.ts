export type AccountType = 'free' | 'paid' | 'premium';

// User DTO - what frontend gets from API
export interface User {
  id: string;
  display_name: string;
  username: string;
  email: string;
  google_id?: string;
  google_avatar?: string;
  discord_id?: string;
  discord_avatar?: string;
  accountType: AccountType;
  createdAt: string;
  updatedAt: string;
}

// Create user request data
export interface CreateUserData {
  display_name: string;
  username: string;
  email: string;
  password?: string;
  google_id?: string;
  google_avatar?: string;
  discord_id?: string;
  discord_avatar?: string;
  guilds?: { id: string; name: string; icon: string | null }[];
}

// Update user request data
export interface UpdateUserData {
  display_name?: string;
  username?: string;
  email?: string;
  password?: string;
  google_id?: string;
  google_avatar?: string;
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

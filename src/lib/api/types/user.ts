export interface User {
  id: string;
  username: string;
  email: string;
  discord_id?: string;
  discord_avatar?: string;
  accountType?: string;  
  createdAt: string;
  updatedAt: string;
}

export interface UserUsage {
  webhookMessagesSentToday: number;
  totalMediaStorageUsed: number;
  dailyWebhookMessageLimit: number;
  overallMediaStorageLimit: number;
}
